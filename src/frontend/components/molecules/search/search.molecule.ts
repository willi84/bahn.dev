const SVG_NS = 'http://www.w3.org/2000/svg';
const DEFAULT_PREFIX = 'WORKING_GROUP_';
const LABEL_LAYER_ID = 'workspace-label-layer';
const HIGHLIGHT_LAYER_ID = 'workspace-highlight-layer';
const FILL_LAYER_ID = 'workspace-fill-layer';
const WORKSPACE_DATA_URL =
    'https://willi84.github.io/hackathon-bahn-2026-api/data.json';

type TeamDetails = {
    TEAM?: string;
    Teilnehmer?: string;
    Mentor?: string;
    Thema?: string;
};

type WorkspaceApiItem = {
    ROOM_ID?: string;
    WORKING_GROUPS?: string;
    PAX?: string;
    NAME_EVENT?: string;
    NAME_ORIGINAL?: string;
    TEAM?: string;
    TeamDetails?: TeamDetails;
};

type WorkspaceApiResponse = {
    items?: WorkspaceApiItem[];
};

type WorkspaceMeta = {
    roomId: string;
    eventName: string;
    originalName: string;
    teamName: string;
    participants: string;
    mentor: string;
    topic: string;
    pax: number;
};

type WorkspaceItem = {
    element: SVGGElement;
    id: string;
    name: string;
    labelTitle: string;
    labelSubtitle: string;
    labelMeta: string;
    eventName: string;
    teamName: string;
    pax: number;
    color: string;
    searchText: string;
    fillOverlay: SVGRectElement;
    highlight: SVGRectElement;
    label: SVGGElement;
};

type FilterOption = {
    label: string;
    value: string;
    color: string;
};

const normalizeSearchValue = (value: string) =>
    value
        .trim()
        .toLowerCase()
        .replace(/[_\-.]+/g, ' ');

const getStringValue = (value?: string) => value?.trim() ?? '';

const escapeSelector = (value: string) => {
    if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') {
        return CSS.escape(value);
    }

    return value.replace(/([#.;?+*~':"!^$\[\]()=>|/@])/g, '\\$1');
};

const parseWorkspaceId = (id: string, prefix: string) => {
    const rawValue = id.slice(prefix.length);
    const [workspaceName = rawValue, paxValue = '1'] = rawValue.split('__');
    const normalizedName = workspaceName.replace(/_/g, ' ').trim();
    const pax = Number.parseInt(paxValue, 10);

    return {
        name: normalizedName,
        pax: Number.isFinite(pax) ? pax : 1,
    };
};

const getWorkspaceMeta = (item?: WorkspaceApiItem): WorkspaceMeta => {
    const details = item?.TeamDetails ?? {};
    const pax = Number.parseInt(getStringValue(item?.PAX), 10);

    return {
        roomId: getStringValue(item?.ROOM_ID),
        eventName: getStringValue(item?.NAME_EVENT),
        originalName: getStringValue(item?.NAME_ORIGINAL),
        teamName: getStringValue(item?.TEAM) || getStringValue(details.TEAM),
        participants: getStringValue(details.Teilnehmer),
        mentor: getStringValue(details.Mentor),
        topic: getStringValue(details.Thema),
        pax: Number.isFinite(pax) ? pax : 0,
    };
};

const getWorkspaceColor = (title: string, subtitle: string) => {
    const value = normalizeSearchValue(`${title} ${subtitle}`);

    if (value.includes('orga') || value.includes('catering')) {
        return '#b596d4';
    }

    if (value.includes('datenstation') || value.includes('mentoring')) {
        return '#84d4ef';
    }

    if (value.includes('meetingpoint') || value.includes('essen')) {
        return '#f6d977';
    }

    if (value.includes('hackspace')) {
        return '#ff858a';
    }

    if (value.includes('back up') || value.includes('backup')) {
        return '#b9dc8a';
    }

    if (value.includes('hackraum')) {
        return '#8dd9ad';
    }

    if (value.includes('plenum') || value.includes('teambuilding')) {
        return '#f1de65';
    }

    return '#d7e6f2';
};

const buildLabelMeta = (workspaceName: string, pax: number) => {
    const segments = [workspaceName];

    if (pax > 0) {
        segments.unshift(`${pax} Pax`);
    }

    return segments.join(' · ');
};

const getLabelCopy = (
    workspaceName: string,
    meta: WorkspaceMeta,
    pax: number
) => {
    const title = meta.eventName || workspaceName;
    const subtitle =
        meta.teamName || meta.originalName || meta.roomId || workspaceName;

    return {
        title,
        subtitle: subtitle === title ? workspaceName : subtitle,
        meta: buildLabelMeta(workspaceName, pax),
    };
};

const buildSearchText = (
    workspaceId: string,
    workspaceName: string,
    meta: WorkspaceMeta,
    pax: number
) =>
    normalizeSearchValue(
        [
            workspaceId,
            workspaceName,
            meta.roomId,
            meta.eventName,
            meta.originalName,
            meta.teamName,
            meta.participants,
            meta.mentor,
            meta.topic,
            `${pax} pax`,
        ].join(' ')
    );

const loadWorkspaceData = async () => {
    try {
        const response = await fetch(WORKSPACE_DATA_URL, { cache: 'no-store' });
        if (!response.ok) {
            return new Map<string, WorkspaceApiItem>();
        }

        const data = (await response.json()) as WorkspaceApiResponse;
        const items = data.items ?? [];

        return new Map(
            items
                .filter((item) => getStringValue(item.WORKING_GROUPS) !== '')
                .map((item) => [getStringValue(item.WORKING_GROUPS), item])
        );
    } catch {
        return new Map<string, WorkspaceApiItem>();
    }
};

/**
 * 🎯 Highlights matching text fragments with the search result marker span.
 * @param {string} text ➡️ Original text that should be partially highlighted.
 * @param {string} searchTerm ➡️ Case-insensitive search term used for highlighting.
 * @returns {string} 📤 HTML string with matching fragments wrapped in the search highlight span.
 */
export const getHighlightedText = (text: string, searchTerm: string) => {
    if (searchTerm === '') {
        return text;
    }

    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
    return parts
        .map((part) =>
            part.toLowerCase() === searchTerm.toLowerCase()
                ? `<span class="search-match">${part}</span>`
                : part
        )
        .join('');
};

const createWorkspaceFill = (workspaceId: string, color: string) => {
    const rect = document.createElementNS(SVG_NS, 'rect');
    rect.classList.add('workspace-fill');
    rect.setAttribute('data-workspace-id', workspaceId);
    rect.setAttribute('fill', color);
    rect.setAttribute('stroke', 'rgba(46, 72, 98, 0.78)');
    rect.setAttribute('pointer-events', 'none');
    return rect;
};

const createWorkspaceHighlight = (workspaceId: string) => {
    const rect = document.createElementNS(SVG_NS, 'rect');
    rect.classList.add('workspace-highlight');
    rect.setAttribute('data-workspace-id', workspaceId);
    rect.setAttribute('fill', 'none');
    rect.setAttribute('pointer-events', 'none');
    return rect;
};

const createWorkspaceLabel = (
    workspaceId: string,
    labelTitle: string,
    labelSubtitle: string,
    labelMeta: string,
    color: string
) => {
    const labelGroup = document.createElementNS(SVG_NS, 'g');
    const background = document.createElementNS(SVG_NS, 'rect');
    const title = document.createElementNS(SVG_NS, 'text');
    const subtitle = document.createElementNS(SVG_NS, 'text');
    const meta = document.createElementNS(SVG_NS, 'text');

    labelGroup.classList.add('workspace-label');
    labelGroup.setAttribute('data-workspace-id', workspaceId);
    labelGroup.setAttribute('pointer-events', 'none');
    labelGroup.style.setProperty('--workspace-label-color', color);

    background.classList.add('workspace-label__background');
    background.setAttribute('rx', '18');
    background.setAttribute('ry', '18');

    title.classList.add('workspace-label__title');
    title.setAttribute('data-role', 'workspace-title');
    title.setAttribute('y', '22');
    title.setAttribute('text-anchor', 'middle');
    title.textContent = labelTitle;

    subtitle.classList.add('workspace-label__subtitle');
    subtitle.setAttribute('data-role', 'workspace-subtitle');
    subtitle.setAttribute('y', '42');
    subtitle.setAttribute('text-anchor', 'middle');
    subtitle.textContent = labelSubtitle;

    meta.classList.add('workspace-label__meta');
    meta.setAttribute('data-role', 'workspace-meta');
    meta.setAttribute('y', '60');
    meta.setAttribute('text-anchor', 'middle');
    meta.textContent = labelMeta;

    labelGroup.append(background, title, subtitle, meta);
    return labelGroup;
};

const setWorkspaceState = (
    workspace: WorkspaceItem,
    isMatch: boolean,
    hasQuery: boolean
) => {
    const isActiveMatch = hasQuery && isMatch;

    workspace.element.classList.toggle(
        'workspace-item--dimmed',
        hasQuery && !isMatch
    );
    workspace.fillOverlay.classList.toggle(
        'workspace-fill--active',
        isActiveMatch
    );
    workspace.highlight.classList.toggle(
        'workspace-highlight--active',
        isActiveMatch
    );
    workspace.label.classList.toggle(
        'workspace-label--dimmed',
        hasQuery && !isMatch
    );
};

const syncWorkspaceOverlay = (workspace: WorkspaceItem) => {
    const bbox = workspace.element.getBBox();
    const fillPadding = 6;
    const outlinePadding = 14;
    const longestLabel = Math.max(
        workspace.labelTitle.length,
        workspace.labelSubtitle.length,
        workspace.labelMeta.length
    );
    const labelWidth = Math.max(220, longestLabel * 8.5 + 42);
    const labelHeight = 72;
    const labelX = bbox.x + bbox.width / 2 - labelWidth / 2;
    const labelY = Math.max(12, bbox.y - labelHeight - 18);

    workspace.fillOverlay.setAttribute('x', String(bbox.x - fillPadding));
    workspace.fillOverlay.setAttribute('y', String(bbox.y - fillPadding));
    workspace.fillOverlay.setAttribute(
        'width',
        String(bbox.width + fillPadding * 2)
    );
    workspace.fillOverlay.setAttribute(
        'height',
        String(bbox.height + fillPadding * 2)
    );
    workspace.fillOverlay.setAttribute('rx', '8');
    workspace.fillOverlay.setAttribute('ry', '8');

    workspace.highlight.setAttribute('x', String(bbox.x - outlinePadding));
    workspace.highlight.setAttribute('y', String(bbox.y - outlinePadding));
    workspace.highlight.setAttribute(
        'width',
        String(bbox.width + outlinePadding * 2)
    );
    workspace.highlight.setAttribute(
        'height',
        String(bbox.height + outlinePadding * 2)
    );
    workspace.highlight.setAttribute('rx', '20');
    workspace.highlight.setAttribute('ry', '20');

    const labelBackground =
        workspace.label.querySelector<SVGRectElement>('rect');
    const labelTitle = workspace.label.querySelector<SVGTextElement>(
        '[data-role="workspace-title"]'
    );
    const labelSubtitle = workspace.label.querySelector<SVGTextElement>(
        '[data-role="workspace-subtitle"]'
    );
    const labelMeta = workspace.label.querySelector<SVGTextElement>(
        '[data-role="workspace-meta"]'
    );

    if (!labelBackground || !labelTitle || !labelSubtitle || !labelMeta) {
        return;
    }

    workspace.label.setAttribute('transform', `translate(${labelX} ${labelY})`);
    labelBackground.setAttribute('width', String(labelWidth));
    labelBackground.setAttribute('height', String(labelHeight));
    labelTitle.setAttribute('x', String(labelWidth / 2));
    labelSubtitle.setAttribute('x', String(labelWidth / 2));
    labelMeta.setAttribute('x', String(labelWidth / 2));
};

const ensureOverlayLayer = (svg: SVGSVGElement, layerId: string) => {
    const existingLayer = svg.querySelector<SVGGElement>(
        `#${escapeSelector(layerId)}`
    );
    if (existingLayer) {
        existingLayer.innerHTML = '';
        return existingLayer;
    }

    const layer = document.createElementNS(SVG_NS, 'g');
    layer.setAttribute('id', layerId);
    layer.setAttribute('pointer-events', 'none');
    svg.appendChild(layer);
    return layer;
};

const buildFilterOptions = (
    workspaces: WorkspaceItem[],
    key: 'eventName' | 'teamName'
) => {
    const map = new Map<string, FilterOption>();

    workspaces.forEach((workspace) => {
        const label = getStringValue(workspace[key]);
        if (label === '') {
            return;
        }

        const normalized = normalizeSearchValue(label);
        if (!map.has(normalized)) {
            map.set(normalized, {
                label,
                value: label,
                color: workspace.color,
            });
        }
    });

    return Array.from(map.values()).sort((a, b) =>
        a.label.localeCompare(b.label, 'de')
    );
};

const renderFilterButtons = (
    container: HTMLElement | null,
    options: FilterOption[],
    searchInput: HTMLInputElement,
    updateResults: () => void
) => {
    if (!container) {
        return [] as HTMLButtonElement[];
    }

    container.innerHTML = '';

    return options.map((option) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'workspace-filter-chip';
        button.textContent = option.label;
        button.dataset.searchValue = option.value;
        button.style.setProperty('--workspace-chip-color', option.color);
        button.addEventListener('click', () => {
            const isActive =
                normalizeSearchValue(searchInput.value) ===
                normalizeSearchValue(option.value);
            searchInput.value = isActive ? '' : option.value;
            updateResults();
        });
        container.appendChild(button);
        return button;
    });
};

const syncFilterButtons = (
    buttons: HTMLButtonElement[],
    searchValue: string
) => {
    const normalized = normalizeSearchValue(searchValue);

    buttons.forEach((button) => {
        const value = button.dataset.searchValue ?? '';
        button.classList.toggle(
            'is-active',
            normalized !== '' && normalizeSearchValue(value) === normalized
        );
    });
};

/**
 * 🎯 Initializes workspace search for SVG-based workspace maps.
 * @param {string} target ➡️ CSS selector or "document" as root lookup target.
 * @param {string} prefix ➡️ Prefix used to find workspace items by id.
 * @returns {void} 📤 Initializes search, highlights and labels when the required DOM is present.
 */
export const createSearch = (
    target: string,
    prefix: string = DEFAULT_PREFIX
) => {
    const initialize = async () => {
        const root =
            target === 'document'
                ? document
                : (document.querySelector(target) ?? document);

        const searchScope = root.querySelector<HTMLElement>(
            '[data-search-scope]'
        );
        const searchInput = root.querySelector<HTMLInputElement>(
            '[data-search-input]'
        );
        const searchStatus = root.querySelector<HTMLElement>(
            '[data-search-status]'
        );
        const clearButton = root.querySelector<HTMLButtonElement>(
            '[data-search-clear]'
        );
        const spaceFilters = root.querySelector<HTMLElement>(
            '[data-space-filters]'
        );
        const teamFilters = root.querySelector<HTMLElement>(
            '[data-team-filters]'
        );
        const teamFilterGroup = root.querySelector<HTMLElement>(
            '[data-team-filter-group]'
        );
        const svg = searchScope?.querySelector<SVGSVGElement>('svg');

        if (!searchScope || !searchInput || !svg) {
            return;
        }

        const workspaceElements = Array.from(
            svg.querySelectorAll<SVGGElement>(`[id^="${prefix}"]`)
        );
        if (!workspaceElements.length) {
            return;
        }

        const workspaceData = await loadWorkspaceData();
        const fillLayer = ensureOverlayLayer(svg, FILL_LAYER_ID);
        const highlightLayer = ensureOverlayLayer(svg, HIGHLIGHT_LAYER_ID);
        const labelLayer = ensureOverlayLayer(svg, LABEL_LAYER_ID);

        const workspaces: WorkspaceItem[] = workspaceElements.map((element) => {
            const id = element.id;
            const parsed = parseWorkspaceId(id, prefix);
            const externalMeta = getWorkspaceMeta(workspaceData.get(id));
            const pax = externalMeta.pax || parsed.pax;
            const labelCopy = getLabelCopy(parsed.name, externalMeta, pax);
            const color = getWorkspaceColor(
                labelCopy.title,
                labelCopy.subtitle
            );
            const fillOverlay = createWorkspaceFill(id, color);
            const highlight = createWorkspaceHighlight(id);
            const label = createWorkspaceLabel(
                id,
                labelCopy.title,
                labelCopy.subtitle,
                labelCopy.meta,
                color
            );

            element.classList.add('workspace-item');
            fillLayer.appendChild(fillOverlay);
            highlightLayer.appendChild(highlight);
            labelLayer.appendChild(label);

            return {
                element,
                id,
                name: parsed.name,
                labelTitle: labelCopy.title,
                labelSubtitle: labelCopy.subtitle,
                labelMeta: labelCopy.meta,
                eventName: externalMeta.eventName,
                teamName: externalMeta.teamName,
                pax,
                color,
                searchText: buildSearchText(id, parsed.name, externalMeta, pax),
                fillOverlay,
                highlight,
                label,
            };
        });

        const syncOverlays = () => {
            workspaces.forEach(syncWorkspaceOverlay);
        };

        const updateResults = () => {
            const query = normalizeSearchValue(searchInput.value);
            const hasQuery = query.length > 0;
            const matches = workspaces.filter(
                (workspace) => !hasQuery || workspace.searchText.includes(query)
            );
            const matchedIds = new Set(
                matches.map((workspace) => workspace.id)
            );

            workspaces.forEach((workspace) => {
                setWorkspaceState(
                    workspace,
                    matchedIds.has(workspace.id),
                    hasQuery
                );
            });

            if (searchStatus) {
                searchStatus.textContent = hasQuery
                    ? `${matches.length} von ${workspaces.length} Workspaces sichtbar`
                    : `${workspaces.length} Workspaces verfügbar`;
            }

            if (clearButton) {
                clearButton.disabled = !hasQuery;
            }

            syncFilterButtons(spaceButtons, searchInput.value);
            syncFilterButtons(teamButtons, searchInput.value);
        };

        const spaceButtons = renderFilterButtons(
            spaceFilters,
            buildFilterOptions(workspaces, 'eventName'),
            searchInput,
            updateResults
        );
        const teamButtons = renderFilterButtons(
            teamFilters,
            buildFilterOptions(workspaces, 'teamName'),
            searchInput,
            updateResults
        );

        if (teamFilterGroup) {
            teamFilterGroup.hidden = teamButtons.length === 0;
        }

        clearButton?.addEventListener('click', () => {
            searchInput.value = '';
            updateResults();
        });

        syncOverlays();
        updateResults();

        searchInput.addEventListener('input', updateResults);
        window.addEventListener('resize', syncOverlays);

        if ('ResizeObserver' in window) {
            const observer = new ResizeObserver(syncOverlays);
            observer.observe(searchScope);
        }

        requestAnimationFrame(syncOverlays);
    };

    void initialize();
};
