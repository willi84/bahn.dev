const SVG_NS = 'http://www.w3.org/2000/svg';
const DEFAULT_PREFIX = 'WORKING_GROUP_';
const MAP_PREFIX = '🗺️ ';
const LABEL_LAYER_ID = 'workspace-label-layer';
const HIGHLIGHT_LAYER_ID = 'workspace-highlight-layer';
const FILL_LAYER_ID = 'workspace-fill-layer';
const AREA_FILL_LAYER_ID = 'workspace-area-fill-layer';
const WORKSPACE_DATA_URL =
    'https://willi84.github.io/hackathon-bahn-2026-api/data.json';
const DEFAULT_MOBILE_ZOOM = 1.5;
const DEFAULT_DESKTOP_ZOOM = 1;
const MIN_ZOOM = 1;
const MAX_ZOOM = 4.8;
const ZOOM_STEP = 0.2;

type TeamDetails = {
    TEAM?: string;
    Teilnehmer?: string;
    Mentor?: string;
    Thema?: string;
};

type WorkspaceApiItem = {
    ROOM_ID?: string;
    WORKING_GROUPS?: string;
    active?: string;
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
    active: boolean;
    pax: number;
};

type WorkspaceItem = {
    element: SVGGElement;
    roomElement: SVGGElement;
    id: string;
    name: string;
    areaKey: string;
    areaLabel: string;
    labelTitle: string;
    labelSubtitle: string;
    labelMeta: string;
    roomId: string;
    roomLabel: string;
    eventName: string;
    originalName: string;
    teamName: string;
    participants: string;
    mentor: string;
    topic: string;
    active: boolean;
    pax: number;
    color: string;
    searchText: string;
    fillOverlay: SVGRectElement;
    highlight: SVGRectElement;
    label: SVGGElement;
};

type HoverCardElements = {
    root: HTMLDivElement;
    eyebrow: HTMLParagraphElement;
    title: HTMLParagraphElement;
    subtitle: HTMLParagraphElement;
    meta: HTMLParagraphElement;
};

type AreaItem = {
    id: string;
    key: string;
    label: string;
    color: string;
    element: SVGGElement;
    overlay?: SVGGElement;
};

type FilterOption = {
    label: string;
    value: string;
    color: string;
    icon: string;
};

const normalizeSearchValue = (value: string) =>
    value
        .trim()
        .toLowerCase()
        .replace(/[_\-.]+/g, ' ');

const getStringValue = (value?: string) => value?.trim() ?? '';

const clamp = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(min, value));

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

const deriveAreaKey = (workspaceName: string) => {
    const parts = workspaceName.trim().split(' ');
    const areaPart = (parts[2] ?? '').split('.')[0];
    return [parts[0], parts[1], areaPart].filter(Boolean).join('_');
};

const prettifyAreaLabel = (areaKey: string) => areaKey.replace(/_/g, ' ');

const formatRoomLabel = (roomId: string) => {
    const normalized = getStringValue(roomId)
        .replace(/^.*ROOM_/, '')
        .replace(/_/g, ' ');

    return normalized === '' ? '' : `Raum ${normalized}`;
};

const escapeHtml = (value: string) =>
    value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

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
        active: getStringValue(item?.active) === 'true',
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

const buildLabelMeta = (
    workspaceName: string,
    pax: number,
    active: boolean
) => {
    const segments = [workspaceName];

    if (pax > 0) {
        segments.unshift(`${pax} Pax`);
    }

    if (!active) {
        segments.push('inactive');
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
        meta: buildLabelMeta(workspaceName, pax, meta.active),
    };
};

const buildSearchText = (
    workspaceId: string,
    workspaceName: string,
    areaLabel: string,
    meta: WorkspaceMeta,
    pax: number
) =>
    normalizeSearchValue(
        [
            workspaceId,
            workspaceName,
            areaLabel,
            meta.roomId,
            meta.eventName,
            meta.originalName,
            meta.teamName,
            meta.participants,
            meta.mentor,
            meta.topic,
            meta.active ? 'active' : 'inactive',
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

const createWorkspaceAreaFill = (area: AreaItem, color: string) => {
    const group = document.createElementNS(SVG_NS, 'g');
    const clone = area.element.cloneNode(true) as SVGGElement;

    group.classList.add('workspace-area-fill');
    group.setAttribute('data-area-key', area.key);
    group.setAttribute('pointer-events', 'none');
    group.style.setProperty('--workspace-area-color', color);

    clone
        .querySelectorAll('[id]')
        .forEach((node) => node.removeAttribute('id'));
    clone.removeAttribute('id');
    group.appendChild(clone);

    return group;
};

const createWorkspaceHighlight = (workspaceId: string, color: string) => {
    const rect = document.createElementNS(SVG_NS, 'rect');
    rect.classList.add('workspace-highlight');
    rect.setAttribute('data-workspace-id', workspaceId);
    rect.setAttribute('fill', 'none');
    rect.setAttribute('pointer-events', 'none');
    rect.style.setProperty('--workspace-outline-color', color);
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

const createHoverCard = (container: HTMLElement) => {
    const card = document.createElement('div');
    const eyebrow = document.createElement('p');
    const title = document.createElement('p');
    const subtitle = document.createElement('p');
    const meta = document.createElement('p');

    card.className = 'workspace-map-hovercard';
    card.hidden = true;

    eyebrow.className = 'workspace-map-hovercard__eyebrow';
    title.className = 'workspace-map-hovercard__title';
    subtitle.className = 'workspace-map-hovercard__subtitle';
    meta.className = 'workspace-map-hovercard__meta';

    card.append(eyebrow, title, subtitle, meta);
    container.appendChild(card);

    return { root: card, eyebrow, title, subtitle, meta } as HoverCardElements;
};

const setWorkspaceState = (
    workspace: WorkspaceItem,
    isMatch: boolean,
    hasQuery: boolean
) => {
    const isActiveMatch = hasQuery && isMatch;

    workspace.element.classList.toggle(
        'workspace-item--inactive',
        !workspace.active
    );
    workspace.roomElement.classList.toggle(
        'workspace-room--inactive',
        !workspace.active
    );
    workspace.roomElement.classList.toggle(
        'workspace-room--match',
        isActiveMatch
    );
    workspace.roomElement.classList.toggle(
        'workspace-room--dimmed',
        hasQuery && !isMatch
    );
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
    workspace.highlight.classList.toggle(
        'workspace-highlight--inactive',
        !isActiveMatch && !workspace.active
    );
    workspace.label.classList.toggle(
        'workspace-label--inactive',
        !workspace.active
    );
    workspace.label.classList.toggle(
        'workspace-label--dimmed',
        hasQuery && !isMatch
    );
};

const syncAreaOverlay = (area: AreaItem) => {
    area.overlay?.style.setProperty('--workspace-area-color', area.color);
};

const syncWorkspaceOverlay = (workspace: WorkspaceItem) => {
    const bbox = workspace.roomElement.getBBox();
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

const buildAreaMap = (svg: SVGSVGElement) => {
    const groups = Array.from(svg.querySelectorAll<SVGGElement>('g[id]'));
    return new Map(
        groups
            .filter((group) => group.id.startsWith(MAP_PREFIX))
            .map((group) => {
                const key = group.id.slice(MAP_PREFIX.length);
                return [
                    key,
                    {
                        id: group.id,
                        key,
                        label: prettifyAreaLabel(key),
                        color: '#dbe4ec',
                        element: group,
                    } as AreaItem,
                ];
            })
    );
};

const buildFilterOptions = (
    workspaces: WorkspaceItem[],
    key: 'eventName' | 'teamName' | 'areaLabel'
) => {
    const map = new Map<string, FilterOption>();

    workspaces.forEach((workspace) => {
        const label = getStringValue(workspace[key]);
        if (label === '') {
            return;
        }

        const normalized = normalizeSearchValue(label);
        if (!map.has(normalized)) {
            const icon =
                key === 'areaLabel' ? '🗺️' : key === 'teamName' ? '👥' : '🪑';

            map.set(normalized, {
                label,
                value: label,
                color: key === 'areaLabel' ? '#dbe4ec' : workspace.color,
                icon,
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
        button.setAttribute('aria-pressed', 'false');
        button.innerHTML = `<span class="workspace-filter-chip__icon" aria-hidden="true">${option.icon}</span><span class="workspace-filter-chip__label">${escapeHtml(option.label)}</span>`;
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
        const isActive =
            normalized !== '' && normalizeSearchValue(value) === normalized;

        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
    });
};

const focusBBox = (
    container: HTMLElement,
    bbox: DOMRect | SVGRect,
    zoom: number
) => {
    const left = Math.max(
        0,
        bbox.x * zoom - container.clientWidth / 2 + (bbox.width * zoom) / 2
    );
    const top = Math.max(
        0,
        bbox.y * zoom - container.clientHeight / 2 + (bbox.height * zoom) / 2
    );

    container.scrollTo({
        left,
        top,
        behavior: 'smooth',
    });
};

const getViewportScale = () => Math.max(1, window.visualViewport?.scale ?? 1);

const getDefaultZoom = () =>
    (window.innerWidth <= 900 ? DEFAULT_MOBILE_ZOOM : DEFAULT_DESKTOP_ZOOM) *
    Math.min(getViewportScale(), 1.35);

const getMaxZoom = () => MAX_ZOOM * Math.min(getViewportScale(), 1.4);

const createPreviewDetail = (icon: string, label: string, value: string) =>
    `<div class="workspace-preview-detail"><span class="workspace-preview-detail__icon" aria-hidden="true">${icon}</span><div class="workspace-preview-detail__copy"><span class="workspace-preview-detail__label">${escapeHtml(label)}</span><span class="workspace-preview-detail__value">${escapeHtml(value)}</span></div></div>`;

const createPreviewSection = (
    title: string,
    details: Array<{ icon: string; label: string; value: string }>
) => {
    const visibleDetails = details.filter(
        (detail) => detail.value.trim() !== ''
    );

    if (!visibleDetails.length) {
        return '';
    }

    return `<section class="workspace-preview-section"><p class="workspace-preview-section__title">${escapeHtml(title)}</p><div class="workspace-preview-section__grid">${visibleDetails
        .map((detail) =>
            createPreviewDetail(detail.icon, detail.label, detail.value)
        )
        .join('')}</div></section>`;
};

const renderResultDetails = (
    container: HTMLElement | null,
    matches: WorkspaceItem[],
    hasQuery: boolean
) => {
    if (!container) {
        return;
    }

    if (!hasQuery || matches.length === 0) {
        container.innerHTML = '';
        return;
    }

    if (matches.length > 1) {
        const first = matches[0];
        const uniqueRooms = Array.from(
            new Set(
                matches.map((workspace) => workspace.roomLabel).filter(Boolean)
            )
        );

        container.innerHTML = [
            createPreviewSection('Überblick', [
                { icon: '🗺️', label: 'Bereich', value: first.areaLabel },
                { icon: '🔎', label: 'Treffer', value: String(matches.length) },
                {
                    icon: '📍',
                    label: 'Räume',
                    value: uniqueRooms.slice(0, 4).join(', '),
                },
            ]),
        ].join('');
        return;
    }

    const match = matches[0];
    container.innerHTML = [
        createPreviewSection('Ergebnis', [
            { icon: '📍', label: 'Raum', value: match.roomLabel },
            { icon: '🪑', label: 'Name im Event', value: match.eventName },
            {
                icon: '👤',
                label: 'Plätze',
                value: match.pax > 0 ? `${match.pax}` : '',
            },
            { icon: '👥', label: 'Team', value: match.teamName },
            { icon: '🗺️', label: 'Bereich', value: match.areaLabel },
        ]),
    ].join('');
};

const renderFocusDetails = (
    container: HTMLElement | null,
    workspace: WorkspaceItem | null
) => {
    if (!container || !workspace) {
        if (container) {
            container.innerHTML = '';
        }
        return;
    }

    container.innerHTML = [
        createPreviewSection('Team', [
            { icon: '👥', label: 'Team', value: workspace.teamName },
            {
                icon: '🧑‍🤝‍🧑',
                label: 'Teilnehmende',
                value: workspace.participants,
            },
            { icon: '🧭', label: 'Mentor', value: workspace.mentor },
            { icon: '💡', label: 'Thema', value: workspace.topic },
        ]),
        createPreviewSection('Workspace', [
            { icon: '🪑', label: 'Name', value: workspace.labelTitle },
            {
                icon: '👤',
                label: 'Plätze',
                value: workspace.pax > 0 ? `${workspace.pax}` : '',
            },
            {
                icon: '✨',
                label: 'Status',
                value: workspace.active ? 'Aktiv' : 'Inaktiv',
            },
        ]),
        createPreviewSection('Raum', [
            { icon: '📍', label: 'Raum', value: workspace.roomLabel },
            { icon: '🗺️', label: 'Bereich', value: workspace.areaLabel },
            {
                icon: '🎪',
                label: 'Name im Event',
                value: workspace.eventName,
            },
            {
                icon: '🏷️',
                label: 'Originalname',
                value:
                    workspace.originalName !== workspace.eventName
                        ? workspace.originalName
                        : '',
            },
        ]),
    ].join('');
};

const updateResultsPreview = (
    previewKind: HTMLElement | null,
    previewTitle: HTMLElement | null,
    previewSubtitle: HTMLElement | null,
    previewMeta: HTMLElement | null,
    previewDetails: HTMLElement | null,
    workspaces: WorkspaceItem[],
    matches: WorkspaceItem[],
    hasQuery: boolean
) => {
    if (!previewKind || !previewTitle || !previewSubtitle || !previewMeta) {
        return;
    }

    if (!hasQuery || matches.length === 0) {
        previewKind.textContent = 'Suchergebnis';
        previewTitle.textContent = 'Space, Team oder Bereich auswählen';
        previewSubtitle.textContent =
            'Suche nach Space, Team, Bereich oder Pax.';
        previewMeta.textContent = `${workspaces.length} Workspaces insgesamt`;
        renderResultDetails(previewDetails, matches, hasQuery);
        return;
    }

    const match = matches[0];
    const groupedTitles = Array.from(
        new Set(matches.map((workspace) => workspace.labelTitle))
    )
        .slice(0, 3)
        .join(' · ');

    previewKind.textContent = matches.length > 1 ? 'Treffergruppe' : 'Treffer';
    previewTitle.textContent =
        matches.length > 1 ? match.areaLabel : match.labelTitle;
    previewSubtitle.textContent =
        matches.length > 1
            ? `${matches.length} passende Workspaces im Bereich`
            : match.roomLabel;
    previewMeta.textContent =
        matches.length > 1 ? groupedTitles : match.teamName || match.areaLabel;
    renderResultDetails(previewDetails, matches, hasQuery);
};

const updateFocusPreview = (
    previewKind: HTMLElement | null,
    previewTitle: HTMLElement | null,
    previewSubtitle: HTMLElement | null,
    previewMeta: HTMLElement | null,
    previewDetails: HTMLElement | null,
    workspace: WorkspaceItem | null
) => {
    if (!previewKind || !previewTitle || !previewSubtitle || !previewMeta) {
        return;
    }

    if (!workspace) {
        previewKind.textContent = 'Hover-Fokus';
        previewTitle.textContent = 'Über einen Workspace fahren';
        previewSubtitle.textContent =
            'Dann erscheinen Team-, Workspace- und Raumdetails hier.';
        previewMeta.textContent = '';
        renderFocusDetails(previewDetails, null);
        return;
    }

    previewKind.textContent = 'Fokus';
    previewTitle.textContent = workspace.labelTitle;
    previewSubtitle.textContent =
        workspace.teamName ||
        workspace.eventName ||
        workspace.roomLabel ||
        workspace.areaLabel;
    previewMeta.textContent = `${workspace.roomLabel} · ${workspace.areaLabel}`;
    renderFocusDetails(previewDetails, workspace);
};

const showHoverCard = (
    hoverCard: HoverCardElements,
    workspace: WorkspaceItem,
    zoom: number
) => {
    const bbox = workspace.roomElement.getBBox();
    const left = bbox.x * zoom + (bbox.width * zoom) / 2;
    const top = Math.max(18, bbox.y * zoom - 18);

    hoverCard.eyebrow.textContent = '';
    hoverCard.title.textContent = workspace.labelTitle;
    hoverCard.subtitle.textContent = '';
    hoverCard.meta.textContent = '';
    hoverCard.root.style.left = `${left}px`;
    hoverCard.root.style.top = `${top}px`;
    hoverCard.root.style.setProperty(
        '--workspace-hover-color',
        workspace.color
    );
    hoverCard.root.hidden = false;
};

const hideHoverCard = (hoverCard: HoverCardElements) => {
    hoverCard.root.hidden = true;
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
        const areaFilters = root.querySelector<HTMLElement>(
            '[data-area-filters]'
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
        const resultKind =
            root.querySelector<HTMLElement>('[data-result-kind]');
        const resultTitle = root.querySelector<HTMLElement>(
            '[data-result-title]'
        );
        const resultSubtitle = root.querySelector<HTMLElement>(
            '[data-result-subtitle]'
        );
        const resultMeta =
            root.querySelector<HTMLElement>('[data-result-meta]');
        const resultDetails = root.querySelector<HTMLElement>(
            '[data-result-details]'
        );
        const focusKind = root.querySelector<HTMLElement>('[data-focus-kind]');
        const focusTitle =
            root.querySelector<HTMLElement>('[data-focus-title]');
        const focusSubtitle = root.querySelector<HTMLElement>(
            '[data-focus-subtitle]'
        );
        const focusMeta = root.querySelector<HTMLElement>('[data-focus-meta]');
        const focusDetails = root.querySelector<HTMLElement>(
            '[data-focus-details]'
        );
        const zoomInButton =
            root.querySelector<HTMLButtonElement>('[data-map-zoom-in]');
        const zoomOutButton = root.querySelector<HTMLButtonElement>(
            '[data-map-zoom-out]'
        );
        const zoomResetButton = root.querySelector<HTMLButtonElement>(
            '[data-map-zoom-reset]'
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

        let currentZoom = getDefaultZoom();
        searchScope.style.setProperty(
            '--workspace-map-zoom',
            String(currentZoom)
        );

        const setZoom = (value: number) => {
            currentZoom = clamp(value, MIN_ZOOM, getMaxZoom());
            searchScope.style.setProperty(
                '--workspace-map-zoom',
                String(currentZoom)
            );
            if (zoomResetButton) {
                zoomResetButton.textContent = `${Math.round(currentZoom * 100)}%`;
            }
        };

        zoomInButton?.addEventListener('click', () =>
            setZoom(currentZoom + ZOOM_STEP)
        );
        zoomOutButton?.addEventListener('click', () =>
            setZoom(currentZoom - ZOOM_STEP)
        );
        zoomResetButton?.addEventListener('click', () => {
            setZoom(getDefaultZoom());
        });

        const workspaceData = await loadWorkspaceData();
        const hoverCard = createHoverCard(searchScope);
        const areaMap = buildAreaMap(svg);
        const roomMap = new Map(
            Array.from(svg.querySelectorAll<SVGGElement>('g[id]')).map(
                (group) => [group.id, group]
            )
        );
        const areaFillLayer = ensureOverlayLayer(svg, AREA_FILL_LAYER_ID);
        const fillLayer = ensureOverlayLayer(svg, FILL_LAYER_ID);
        const highlightLayer = ensureOverlayLayer(svg, HIGHLIGHT_LAYER_ID);
        const labelLayer = ensureOverlayLayer(svg, LABEL_LAYER_ID);

        const workspaces: WorkspaceItem[] = workspaceElements.map((element) => {
            const id = element.id;
            const parsed = parseWorkspaceId(id, prefix);
            const externalMeta = getWorkspaceMeta(workspaceData.get(id));
            const roomElement = roomMap.get(externalMeta.roomId) ?? element;
            const roomLabel = formatRoomLabel(externalMeta.roomId);
            const areaKey = deriveAreaKey(parsed.name);
            const areaLabel = prettifyAreaLabel(areaKey);
            const pax = externalMeta.pax || parsed.pax;
            const labelCopy = getLabelCopy(parsed.name, externalMeta, pax);
            const color = getWorkspaceColor(
                labelCopy.title,
                labelCopy.subtitle
            );
            const fillOverlay = createWorkspaceFill(id, color);
            const highlight = createWorkspaceHighlight(id, color);
            const label = createWorkspaceLabel(
                id,
                labelCopy.title,
                labelCopy.subtitle,
                labelCopy.meta,
                color
            );

            element.classList.add('workspace-item');
            roomElement.style.setProperty('--workspace-room-color', color);
            fillLayer.appendChild(fillOverlay);
            highlightLayer.appendChild(highlight);
            labelLayer.appendChild(label);

            return {
                element,
                roomElement,
                id,
                name: parsed.name,
                areaKey,
                areaLabel,
                labelTitle: labelCopy.title,
                labelSubtitle: labelCopy.subtitle,
                labelMeta: labelCopy.meta,
                roomId: externalMeta.roomId,
                roomLabel,
                eventName: externalMeta.eventName,
                originalName: externalMeta.originalName,
                teamName: externalMeta.teamName,
                participants: externalMeta.participants,
                mentor: externalMeta.mentor,
                topic: externalMeta.topic,
                active: externalMeta.active,
                pax,
                color,
                searchText: buildSearchText(
                    id,
                    parsed.name,
                    areaLabel,
                    externalMeta,
                    pax
                ),
                fillOverlay,
                highlight,
                label,
            };
        });

        const areaWorkspaces = new Map<string, WorkspaceItem[]>();

        workspaces.forEach((workspace) => {
            const existing = areaWorkspaces.get(workspace.areaKey) ?? [];
            existing.push(workspace);
            areaWorkspaces.set(workspace.areaKey, existing);
        });

        areaMap.forEach((area) => {
            const areaItems = areaWorkspaces.get(area.key) ?? [];
            const areaColor =
                areaItems.find((item) => item.active)?.color ??
                areaItems[0]?.color ??
                area.color;
            const overlay = createWorkspaceAreaFill(area, areaColor);

            area.color = areaColor;
            area.overlay = overlay;
            area.element.style.setProperty('--workspace-area-color', areaColor);
            areaFillLayer.appendChild(overlay);
            syncAreaOverlay(area);
        });

        let hoveredWorkspace: WorkspaceItem | null = null;

        workspaces.forEach((workspace) => {
            if (!workspace.active) {
                workspace.element.classList.add('workspace-item--inactive');
                workspace.roomElement.classList.add('workspace-room--inactive');
                workspace.label.classList.add('workspace-label--inactive');
            }

            const setHovered = (isHovered: boolean) => {
                if (isHovered) {
                    focusWorkspace(workspace);
                } else if (hoveredWorkspace === workspace) {
                    focusWorkspace(null);
                }

                workspace.label.classList.toggle(
                    'workspace-label--hovered',
                    isHovered
                );
                workspace.roomElement.classList.toggle(
                    'workspace-room--hovered',
                    isHovered
                );
                workspace.roomElement.classList.toggle(
                    'workspace-room--hover-highlight',
                    isHovered
                );
                workspace.fillOverlay.classList.toggle(
                    'workspace-fill--hovered',
                    isHovered
                );
                workspace.highlight.classList.toggle(
                    'workspace-highlight--hovered',
                    isHovered
                );
            };

            workspace.element.addEventListener('mouseenter', () =>
                setHovered(true)
            );
            workspace.element.addEventListener('mouseleave', () =>
                setHovered(false)
            );
            workspace.label.addEventListener('mouseenter', () =>
                setHovered(true)
            );
            workspace.label.addEventListener('mouseleave', () =>
                setHovered(false)
            );
        });

        const syncOverlays = () => {
            areaMap.forEach(syncAreaOverlay);
            workspaces.forEach(syncWorkspaceOverlay);
        };

        let areaButtons: HTMLButtonElement[] = [];
        let spaceButtons: HTMLButtonElement[] = [];
        let teamButtons: HTMLButtonElement[] = [];

        function focusWorkspace(workspace: WorkspaceItem | null) {
            hoveredWorkspace = workspace;

            if (!workspace) {
                hideHoverCard(hoverCard);
                updateFocusPreview(
                    focusKind,
                    focusTitle,
                    focusSubtitle,
                    focusMeta,
                    focusDetails,
                    null
                );
                return;
            }

            showHoverCard(hoverCard, workspace, currentZoom);
            updateFocusPreview(
                focusKind,
                focusTitle,
                focusSubtitle,
                focusMeta,
                focusDetails,
                workspace
            );
        }

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

            const matchedAreaKeys = new Set(
                matches.map((workspace) => workspace.areaKey)
            );
            areaMap.forEach((area) => {
                const isMatchedArea = hasQuery && matchedAreaKeys.has(area.key);
                const isDimmedArea = hasQuery && !matchedAreaKeys.has(area.key);

                area.element.classList.toggle(
                    'workspace-area--match',
                    isMatchedArea
                );
                area.element.classList.toggle(
                    'workspace-area--dimmed',
                    isDimmedArea
                );
                area.overlay?.classList.toggle(
                    'workspace-area-fill--active',
                    isMatchedArea
                );
                area.overlay?.classList.toggle(
                    'workspace-area-fill--dimmed',
                    isDimmedArea
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

            syncFilterButtons(areaButtons, searchInput.value);
            syncFilterButtons(spaceButtons, searchInput.value);
            syncFilterButtons(teamButtons, searchInput.value);
            updateResultsPreview(
                resultKind,
                resultTitle,
                resultSubtitle,
                resultMeta,
                resultDetails,
                workspaces,
                matches,
                hasQuery
            );

            if (hasQuery && matches.length > 0) {
                const uniqueAreas = new Set(
                    matches.map((workspace) => workspace.areaKey)
                );
                const hasSingleArea = uniqueAreas.size === 1;

                if (hasSingleArea) {
                    const targetZoom = Math.max(
                        currentZoom,
                        window.innerWidth <= 900 ? 3.4 : 2.2
                    );
                    setZoom(targetZoom);
                }

                const areaMatch = areaMap.get(matches[0].areaKey);
                const bbox = hasSingleArea
                    ? (areaMatch?.element.getBBox() ??
                      matches[0].roomElement.getBBox())
                    : matches[0].roomElement.getBBox();
                focusBBox(searchScope, bbox, currentZoom);
            }

            if (hoveredWorkspace) {
                showHoverCard(hoverCard, hoveredWorkspace, currentZoom);
            }
        };

        areaButtons = renderFilterButtons(
            areaFilters,
            buildFilterOptions(workspaces, 'areaLabel'),
            searchInput,
            updateResults
        );
        spaceButtons = renderFilterButtons(
            spaceFilters,
            buildFilterOptions(workspaces, 'eventName'),
            searchInput,
            updateResults
        );
        teamButtons = renderFilterButtons(
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

        updateFocusPreview(
            focusKind,
            focusTitle,
            focusSubtitle,
            focusMeta,
            focusDetails,
            null
        );

        searchInput.addEventListener('input', updateResults);
        window.addEventListener('resize', () => {
            if (window.innerWidth <= 900 && currentZoom < getDefaultZoom()) {
                setZoom(getDefaultZoom());
            }
            syncOverlays();
            areaMap.forEach((area) => {
                area.element.style.setProperty(
                    '--workspace-area-color',
                    area.color
                );
            });
            if (hoveredWorkspace) {
                showHoverCard(hoverCard, hoveredWorkspace, currentZoom);
            }
        });

        searchScope.addEventListener('scroll', () => {
            if (hoveredWorkspace) {
                showHoverCard(hoverCard, hoveredWorkspace, currentZoom);
            }
        });

        if ('ResizeObserver' in window) {
            const observer = new ResizeObserver(syncOverlays);
            observer.observe(searchScope);
        }

        requestAnimationFrame(syncOverlays);
    };

    void initialize();
};
