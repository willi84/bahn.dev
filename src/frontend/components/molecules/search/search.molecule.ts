const SVG_NS = 'http://www.w3.org/2000/svg';
const DEFAULT_PREFIX = 'WORKING_GROUP_';
const LABEL_LAYER_ID = 'workspace-label-layer';
const HIGHLIGHT_LAYER_ID = 'workspace-highlight-layer';
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
    pax: number;
    searchText: string;
    highlight: SVGRectElement;
    label: SVGGElement;
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
    labelMeta: string
) => {
    const labelGroup = document.createElementNS(SVG_NS, 'g');
    const background = document.createElementNS(SVG_NS, 'rect');
    const title = document.createElementNS(SVG_NS, 'text');
    const subtitle = document.createElementNS(SVG_NS, 'text');
    const meta = document.createElementNS(SVG_NS, 'text');

    labelGroup.classList.add('workspace-label');
    labelGroup.setAttribute('data-workspace-id', workspaceId);
    labelGroup.setAttribute('pointer-events', 'none');

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
    workspace.element.classList.toggle('workspace-item--match', isMatch);
    workspace.element.classList.toggle(
        'workspace-item--dimmed',
        hasQuery && !isMatch
    );
    workspace.highlight.classList.toggle(
        'workspace-highlight--active',
        isMatch
    );
    workspace.label.classList.toggle(
        'workspace-label--dimmed',
        hasQuery && !isMatch
    );
};

const syncWorkspaceOverlay = (workspace: WorkspaceItem) => {
    const bbox = workspace.element.getBBox();
    const padding = 14;
    const longestLabel = Math.max(
        workspace.labelTitle.length,
        workspace.labelSubtitle.length,
        workspace.labelMeta.length
    );
    const labelWidth = Math.max(220, longestLabel * 8.5 + 42);
    const labelHeight = 72;
    const labelX = bbox.x + bbox.width / 2 - labelWidth / 2;
    const labelY = Math.max(12, bbox.y - labelHeight - 18);

    workspace.highlight.setAttribute('x', String(bbox.x - padding));
    workspace.highlight.setAttribute('y', String(bbox.y - padding));
    workspace.highlight.setAttribute('width', String(bbox.width + padding * 2));
    workspace.highlight.setAttribute(
        'height',
        String(bbox.height + padding * 2)
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
        const highlightLayer = ensureOverlayLayer(svg, HIGHLIGHT_LAYER_ID);
        const labelLayer = ensureOverlayLayer(svg, LABEL_LAYER_ID);

        const workspaces: WorkspaceItem[] = workspaceElements.map((element) => {
            const id = element.id;
            const parsed = parseWorkspaceId(id, prefix);
            const externalMeta = getWorkspaceMeta(workspaceData.get(id));
            const pax = externalMeta.pax || parsed.pax;
            const labelCopy = getLabelCopy(parsed.name, externalMeta, pax);
            const highlight = createWorkspaceHighlight(id);
            const label = createWorkspaceLabel(
                id,
                labelCopy.title,
                labelCopy.subtitle,
                labelCopy.meta
            );

            element.classList.add('workspace-item');
            highlightLayer.appendChild(highlight);
            labelLayer.appendChild(label);

            return {
                element,
                id,
                name: parsed.name,
                labelTitle: labelCopy.title,
                labelSubtitle: labelCopy.subtitle,
                labelMeta: labelCopy.meta,
                pax,
                searchText: buildSearchText(id, parsed.name, externalMeta, pax),
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
                    : `${workspaces.length} Workspaces sichtbar`;
            }
        };

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
