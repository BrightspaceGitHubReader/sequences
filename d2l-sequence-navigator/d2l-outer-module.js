import './d2l-inner-module.js';
import './d2l-activity-link.js';
import { CompletionStatusMixin } from '../mixins/completion-status-mixin.js';
import { PolymerASVLaunchMixin } from '../mixins/polymer-asv-launch-mixin.js';
import { formatAvailabilityDateString, createDateFromObj } from '../util/util.js';
import '@brightspace-ui-labs/accordion/accordion.js';
import '@brightspace-ui/core/components/colors/colors.js';
import '@brightspace-ui/core/components/icons/icon.js';
import '@brightspace-ui/core/components/button/button-subtle.js';
import '@brightspace-ui/core/components/tooltip/tooltip.js';
import 'd2l-offscreen/d2l-offscreen.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
/*
@memberOf window.D2L.Polymer.Mixins;
@mixes D2L.Polymer.Mixins.CompletionStatusMixin
@mixes D2L.Polymer.Mixins.PolymerASVLaunchMixin
*/

class D2LOuterModule extends PolymerASVLaunchMixin(CompletionStatusMixin()) {
	static get template() {
		return html`
		<style>
			:host {
				display: block;
				@apply --d2l-body-compact-text;
				--d2l-outer-module-text-color: var(--d2l-color-ferrite);
				--expand-icon-padding: 10px;
			}

			d2l-labs-accordion-collapse {
				border: 1px solid var(--d2l-color-mica);
				border-radius: 6px;
			}

			#header-container {
				box-sizing: border-box;
				padding: 15px 18px;
				color: var(--d2l-outer-module-text-color);
				cursor: pointer;
				border-radius: 6px;
			}

			#header-container.hide-description,
			:host([show-loading-skeleton]) #header-container {
				cursor: default;
			}

			.start-date-text {
				margin: 0;
				text-align: right;
				color: var(--d2l-outer-module-text-color);
			}

			.module-header {
				display: table;
				table-layout: fixed;
				width: 100%;
			}

			:host([show-loading-skeleton]) .module-header {
				display: none;
			}

			#top-header-container {
				display: flex;
				justify-content: space-between;
			}

			.module-title {
				@apply --d2l-body-compact-text;
				font-weight: 700;
				overflow: hidden;
				text-overflow: ellipsis;
				float: left;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2; /* number of lines to show */
				max-height: 2.4rem; /* fallback */
			}

			.module-completion-count {
				@apply --d2l-body-small-text;
				font-weight: 700;
				color: var(--d2l-outer-module-text-color);
				text-align: right;
				float: right;
				display: flex;
				line-height: inherit !important;
				align-items: center;
				justify-content: center;
				margin: 0;
			}

			ol {
				list-style-type: none;
				border-collapse: collapse;
				margin: 0;
				padding: 0 18px;
			}

			.optionalStatus {
				color: var(--d2l-color-tungsten);
			}

			d2l-icon {
				color: var(--d2l-outer-module-text-color);
			}

			hr {
				border: solid var(--d2l-color-mica);
				border-width: 1px 0 0 0;
				width: 100%;
				margin: 24px 0 0 0;
			}

			li {
				padding-top: 6px;
			}

			div.date-container {
				display: flex;
				justify-content: space-between;
			}

			#due-date, #availability-dates {
				color: var(--d2l-outer-module-text-color, inherit);
				font-size: 0.65rem;
				font-weight: var(--d2l-body-small-text_-_font-weight);
				line-height: var(--d2l-body-small-text_-_line-height);
			}

			:host([show-loading-skeleton]) .date-container {
				display: none;
			}

			#launch-module-container {
				display: flex;
				align-items: center;
				justify-content: center;
				padding: 5px 0;
			}

			:host([is-sidebar]) #launch-module-container {
				display: none;
			}

			:host([show-loading-skeleton]) #launch-module-container > d2l-button-subtle {
				display: none;
			}

			#expand-icon {
				padding-left: var(--expand-icon-padding);
			}

			:host(:dir(rtl)) #expand-icon {
				padding-left: initial;
				padding-right: var(--expand-icon-padding);
			}

			@keyframes loadingShimmer {
				0% { background-color: var(--d2l-color-sylvite); }
				50% { background-color: var(--d2l-color-regolith); }
				75% { background-color: var(--d2l-color-sylvite); }
				100% { background-color: var(--d2l-color-sylvite); }
			}
			@-webkit-keyframes webkitLoadingShimmer {
				0% { background-color: var(--d2l-color-sylvite); }
				50% { background-color: var(--d2l-color-regolith); }
				75% { background-color: var(--d2l-color-sylvite); }
				100% { background-color: var(--d2l-color-sylvite); }
			}

			.skeleton {
				animation: loadingShimmer 1.8s ease-in-out infinite;
				-webkit-animation: webkitLoadingShimmer 1.8s ease-in-out infinite;
				display: none;
				border-radius: 4px;
				background-color: var(--d2l-color-sylvite);
				overflow: hidden;
				position: relative;
			}

			:host([show-loading-skeleton]) .skeleton {
				display: block;
			}

			#header-skeleton-container {
				display: none;
				justify-content: space-between;
				height: 18px;
				width: 100%;
			}

			:host([show-loading-skeleton]) #header-skeleton-container {
				display: flex;
			}

			#header-skeleton {
				height: 100%;
				width: 35%;
			}

			#completion-skeleton {
				height: 100%;
				width: 10%;
			}

			div#launch-module-skeleton.skeleton {
				height: 24px;
				width: 20%;
				display: block;
			}

			:host([accordion-state="closed"]) #header-container:hover {
				background-color: var(--d2l-color-gypsum);
			}

			:host([accordion-state="open"]) #header-container:hover .module-header {
				background-color: var(--d2l-color-gypsum);
				box-shadow: 0 0 0 8px var(--d2l-color-gypsum), 0 0 0 10px #ffffff;
				border-radius: 2px;
			}

			#header-container:hover * {
				color: var(--d2l-color-celestine-minus-1);
			}

			d2l-tooltip {
				color: white !important;
			}

			:host([header-focused][accordion-state="closed"]) #header-container {
				background-color: var(--d2l-color-gypsum);
				box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px var(--d2l-color-celestine);
			}

			:host([header-focused][accordion-state="open"]) .module-header {
				background-color: var(--d2l-color-gypsum);
				border-radius: 2px;
    			box-shadow: 0 0 0 8px var(--d2l-color-gypsum), 0 0 0 10px #ffffff, 0 0 0 12px var(--d2l-color-celestine);
			}

			:host([header-focused]) .module-title {
				color: var(--d2l-color-celestine-minus-1);
			}

			:host([header-active][accordion-state="open"]) .module-header {
				background-color: var(--d2l-color-gypsum);
				box-shadow: 0 0 0 8px var(--d2l-color-gypsum), 0 0 0 10px #ffffff;
				border-radius: 2px;
			}

			:host([header-active][accordion-state="closed"]) #header-container {
				background-color: var(--d2l-color-gypsum);
			}

			:host([header-active]) #header-container * {
				color: var(--d2l-color-celestine-minus-1);
			}
		</style>

		<siren-entity href="[[lastViewedContentObject]]" token="[[token]]" entity="{{_lastViewedContentObjectEntity}}"></siren-entity>
		<siren-entity href="[[currentActivity]]" token="[[token]]" entity="{{_currentActivityEntity}}"></siren-entity>
		<d2l-labs-accordion-collapse no-icons="" flex="" disable-default-trigger-focus>
			<div slot="header" id="header-container" class$="[[isEmpty(subEntities)]] [[_getHideDescriptionClass(_hideModuleDescription)]]">
				<div id="header-skeleton-container">
					<div id="header-skeleton" class="skeleton"></div>
					<div id="completion-skeleton" class="skeleton"></div>
				</div>
				<div class="module-header">
					<div id="top-header-container">
						<span class="module-title">[[entity.properties.title]]</span>
						<div class="module-completion-count">
							<template is="dom-if" if="[[showCount]]">
								<span class="countStatus" aria-hidden="true">
									[[localize('sequenceNavigator.countStatus', 'completed', completionCompleted, 'total', completionTotal)]]
								</span>
								<d2l-offscreen>[[localize('sequenceNavigator.requirementsCompleted', 'completed', completionCompleted, 'total', completionTotal)]]</d2l-offscreen>
							</template>
							<template is="dom-if" if="[[showCheckmark]]">
								<span class="completedStatus">
									<d2l-icon aria-label$="[[localize('sequenceNavigator.completed')]]" icon="tier1:check"></d2l-icon>
								</span>
							</template>
							<template is="dom-if" if="[[!showCheckmark]]">
								<h6 class="start-date-text" aria-label$="[[entity.properties.startDateText]]" >[[entity.properties.startDateText]]</h6>
							</template>
							<template is="dom-if" if="[[showOptional]]">
								<span class="optionalStatus">
									[[localize('sequenceNavigator.optional')]]
								</span>
							</template>
							<d2l-icon id="expand-icon" icon="[[_iconName]]"></d2l-icon>
						</div>
					</div>
					<div class="date-container">
						<div id="due-date">[[_dueDate]]</div>
						<div id="availability-dates" tabindex$="[[_getTabIndex(_showDates)]]" role="note">[[_availabilityDateString]]</div>
						<d2l-tooltip
							for="availability-dates"
							boundary="[[_availDateTooltipBoundary]]"
						>[[_availabilityDateTooltip]]</d2l-tooltip>
					</div>
				</div>
			</div>
			<template is="dom-if" if="[[_getShowModuleChildren(_moduleStartOpen, accordionState)]]">
				<div id="launch-module-container">
					<template is="dom-if" if="[[_showChildSkeletons(showLoadingSkeleton, _childrenLoading)]]">
						<div id="launch-module-skeleton" class="skeleton"></div>
					</template>
					<template is="dom-if" if="[[!_showChildSkeletons(showLoadingSkeleton, _childrenLoading)]]">
						<d2l-button-subtle
							aria-label$="[[localize('sequenceNavigator.launchModule')]]"
							text="[[localize('sequenceNavigator.launchModule')]]"
							icon="tier1:move-to"
							on-click="_onLaunchModuleButtonClick"
						></d2l-button-subtle>
					</template>
				</div>
				<ol>
					<template is="dom-repeat" items="[[subEntities]]" as="childLink">
						<li on-click="_onActivityClicked">
							<template is="dom-if" if="[[_isActivity(childLink)]]">
								<d2l-activity-link
									show-loading-skeleton="[[_showChildSkeletons(showLoadingSkeleton, _childrenLoading)]]"
									last-module$="[[lastModule]]"
									href="[[childLink.href]]"
									token="[[token]]"
									current-activity="{{currentActivity}}"
									on-sequencenavigator-d2l-activity-link-current-activity="childIsActiveEvent"
									on-d2l-content-entity-loaded="checkIfChildrenDoneLoading"
									show-underline="[[_nextActivitySiblingIsActivity(subEntities, index)]]"
									is-sidebar="[[isSidebar]]"
								></d2l-activity-link>
							</template>
							<template is="dom-if" if="[[!_isActivity(childLink)]]">
								<d2l-inner-module
									show-loading-skeleton="[[_showChildSkeletons(showLoadingSkeleton, _childrenLoading)]]"
									href="[[childLink.href]]"
									token="[[token]]"
									current-activity="{{currentActivity}}"
									on-sequencenavigator-d2l-inner-module-current-activity="childIsActiveEvent"
									on-d2l-content-entity-loaded="checkIfChildrenDoneLoading"
									is-sidebar="[[isSidebar]]"
								></d2l-inner-module>
							</template>
						</li>
					</template>
				</ol>
			</template>
		</d2l-labs-accordion-collapse>
		`;
	}

	static get is() {
		return 'd2l-outer-module';
	}

	static get behaviors() {
		D2L.PolymerBehaviors.LocalizeBehavior;
	}

	static get properties() {
		return {
			currentActivity: {
				type: String,
				value: '',
				notify: true
			},
			_currentActivityEntity: {
				type: Object
			},
			subEntities: {
				type: Array,
				computed: 'getSubEntities(entity)'
			},
			hasChildren: {
				type: Boolean,
				computed: '_hasChildren(entity)'
			},
			showCount: {
				type: Boolean,
				value: false,
				computed: '_showCount(completionCount)'
			},
			showCheckmark: {
				type: Boolean,
				value: false,
				computed: '_showCheckmark(completionCount)'
			},
			showOptional: {
				type: Boolean,
				value: false,
				computed: '_showOptional(completionCount)'
			},
			lastModule: {
				type: Boolean,
				value: false
			},
			_dueDate: {
				type: String,
				value: '',
				computed: '_getDueDateText(entity.properties)'
			},
			_availabilityDateString: {
				type: String,
				value: '',
				computed: '_getAvailabilityDateString(entity.properties)'
			},
			_availabilityDateTooltip: {
				type: String,
				value: '',
				computed: '_getAvailabilityDateTooltip(entity.properties)'
			},
			_availDateTooltipBoundary: {
				type: Object,
				value: {
					top: 18,
					bottom: 18,
					right: 18,
					left: 18
				}
			},
			showLoadingSkeleton: {
				type: Boolean,
				value: true,
				reflectToAttribute: true
			},
			_hideModuleDescription: {
				type: Boolean,
				computed: '_getHideModuleDescription(entity)'
			},
			lastViewedContentObject: {
				type: String
			},
			_lastViewedContentObjectEntity: {
				type: Object
			},
			_moduleStartOpen: {
				type: Boolean,
				computed: '_getModuleStartOpen(entity, subEntities, _lastViewedContentObjectEntity, _currentActivityEntity)'
			},
			_childrenLoading: {
				type: Boolean,
				value: true
			},
			_childrenLoadingTracker: {
				type: Object,
				computed: '_setUpChildrenLoadingTracker(subEntities)'
			},
			_iconName: {
				type: String,
				value: 'tier1:arrow-expand-small'
			},
			isSidebar: {
				type: Boolean,
				reflectToAttribute: true,
				value: false
			},
			accordionState: {
				type: String,
				reflectToAttribute: true,
				value: 'closed'
			},
			headerFocused: {
				type: Boolean,
				reflectToAttribute: true,
				value: false
			},
			headerActive: {
				type: Boolean,
				reflectToAttribute: true,
				computed: '_checkModuleHeaderActive(currentActivity, entity, _hideModuleDescription)'
			}
		};
	}

	ready() {
		super.ready();
		// Set the starting icon depending on the collapse state
		this._updateCollapseStateAndIconName();
	}

	static get observers() {
		return [
			'_openModule(_moduleStartOpen)',
			'_checkForEarlyLoadEvent(entity, subEntities, _moduleStartOpen)',
		];
	}

	connectedCallback() {
		super.connectedCallback();
		this.addEventListener('d2l-labs-accordion-collapse-clicked', this._onHeaderClicked);
		this.addEventListener('d2l-labs-accordion-collapse-state-changed', this._updateCollapseStateAndIconName);
		this.addEventListener('d2l-labs-accordion-collapse-toggle-focus', this._onHeaderFocus);
		this.addEventListener('d2l-labs-accordion-collapse-toggle-blur', this._onHeaderBlur);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.removeEventListener('d2l-labs-accordion-collapse-clicked', this._onHeaderClicked);
		this.removeEventListener('d2l-labs-accordion-collapse-state-changed', this._updateCollapseStateAndIconName);
		this.removeEventListener('d2l-labs-accordion-collapse-toggle-focus', this._onHeaderFocus);
		this.removeEventListener('d2l-labs-accordion-collapse-toggle-blur', this._onHeaderBlur);
	}

	_isAccordionOpen() {
		if (!this.shadowRoot || !this.shadowRoot.querySelector('d2l-labs-accordion-collapse')) {
			return false;
		}
		return this.shadowRoot.querySelector('d2l-labs-accordion-collapse').hasAttribute('opened');
	}

	_isOptionalModule() {
		return this.completionCount && this.completionCount.total === 0 && this.completionCount.optionalTotal > 0;
	}

	_isAllRequiredViewed() {
		return this.completionCount && this.completionCount.total > 0 && this.completionCount.total === this.completionCount.completed;
	}

	_isActivity(link) {
		return link && link.hasClass('sequenced-activity');
	}

	_nextActivitySiblingIsActivity(subEntities, index) {
		if (index >= subEntities.length) {
			return false;
		}

		const nextSibling = subEntities[index + 1];

		return this._isActivity(nextSibling);
	}

	_showCount() {
		if (!this.hasChildren) {
			return false;
		}
		if (this._isAccordionOpen()) {
			return true;
		}
		return !this._isOptionalModule() && !this._isAllRequiredViewed();
	}

	_showCheckmark() {
		if (!this.hasChildren) {
			return false;
		}
		if (this._isAccordionOpen()) {
			return false;
		}
		return !this._isOptionalModule() && this._isAllRequiredViewed();
	}

	_showOptional() {
		if (!this.hasChildren) {
			return false;
		}
		if (this._isAccordionOpen()) {
			return false;
		}
		return this._isOptionalModule();
	}

	getSubEntities(entity) {
		return entity && entity.getSubEntities()
			.filter(subEntity => (subEntity.hasClass('sequenced-activity') && subEntity.hasClass('available')) || (subEntity.href && subEntity.hasClass('sequence-description')))
			.map(this._getHref);
	}

	_getHref(entity) {
		return entity && entity.getLinkByRel && entity.getLinkByRel('self') || entity || '';
	}

	_hasChildren(entity) {
		return entity && entity.getSubEntities().length !== 0;
	}

	_getModuleStartOpen(entity, subEntities, _lastViewedContentObjectEntity, _currentActivityEntity) {
		if (!entity || (!_lastViewedContentObjectEntity && !_currentActivityEntity)) {
			return false;
		}

		// FixMe: This is kind of gross. ideally we decouple all the isSidebar stuff into separate components
		// If this is a sidebar, we use the currentActivity to detect if this should be open.
		// If on the launcher, lastViewedContentObject is used.
		if (this.isSidebar) {
			const isCurrentActivityEndOfSequence = _currentActivityEntity.hasClass('end-of-sequence');

			if (isCurrentActivityEndOfSequence) {
				return false;
			}

			const currentActivityParentHref = _currentActivityEntity.getLinkByRel('up').href;

			const isCurrentModuleCurrentActivity = _currentActivityEntity.getLinkByRel('self').href === this.href;
			const isDirectChildOfCurrentModule = currentActivityParentHref === this.href;
			const isChildOfSubModule = subEntities.some((s) => s.href === currentActivityParentHref);

			return isCurrentModuleCurrentActivity || isDirectChildOfCurrentModule || isChildOfSubModule;
		} else {
			const lastViewedParentHref = _lastViewedContentObjectEntity.getLinkByRel('up').href;

			const isCurrentModuleLastViewedContentObject = _lastViewedContentObjectEntity.getLinkByRel('self').href === this.href;
			const isDirectChildOfCurrentModule = lastViewedParentHref === this.href;
			const isChildOfSubModule = subEntities.some((s) => s.href === lastViewedParentHref);

			return isCurrentModuleLastViewedContentObject || isDirectChildOfCurrentModule || isChildOfSubModule;
		}
	}

	_onActivityClicked(e) {
		const childLink =	e.model.__data.childLink;
		if (childLink.class.includes('sequenced-activity') && this.currentActivity !== childLink.href) {
			this.currentActivity = childLink.href;
		}
	}

	_onHeaderClicked() {
		if (!this._hideModuleDescription && this.isSidebar) {
			this.currentActivity = this.entity.getLinkByRel('self').href;
			this._contentObjectClick();
		}
	}

	_getShowModuleChildren(_moduleStartOpen, accordionState) {
		return _moduleStartOpen || accordionState === 'open';
	}

	childIsActiveEvent() {
		this.shadowRoot.querySelector('d2l-labs-accordion-collapse').setAttribute('opened', '');
	}

	isEmpty(subEntities) {
		if ((subEntities === null || subEntities.length === 0) && !this.lastModule) {
			return 'empty-module-header-container';
		}
		else {
			return '';
		}
	}

	_getDueDateText(properties) {
		if (!properties) {
			return;
		}

		const { dueDate } = properties;

		if (!dueDate) {
			return;
		}
		const actualDueDate = createDateFromObj(dueDate);
		const dueDateString = this.formatDate(actualDueDate,  {format: 'medium'});

		return this.localize('sequenceNavigator.due', 'dueDate', dueDateString);
	}

	_getAvailabilityDateString(properties) {
		if (!properties) {
			return;
		}
		const { startDate, endDate } = properties;
		return formatAvailabilityDateString(this.localize, startDate, endDate);
	}

	_getAvailabilityDateTooltip(properties) {
		if (!properties) {
			return;
		}
		const { startDate, endDate } = properties;
		return formatAvailabilityDateString(this.localize, startDate, endDate, true);
	}

	_getHideModuleDescription(entity) {
		return Boolean(entity) && entity.hasClass('hide-description');
	}

	_hasActiveChild(entity, currentActivity) {
		const hasActiveTopic = Boolean(entity) && entity.entities.some(subEntity => subEntity.href === currentActivity);
		const innerModules = this.shadowRoot && this.shadowRoot.querySelectorAll('d2l-inner-module') || [];
		const hasActiveModule = [...innerModules].some(innerMod => innerMod.hasAttribute('has-active-child'));

		return hasActiveTopic || hasActiveModule;
	}

	_updateCollapseStateAndIconName() {
		if (this._isAccordionOpen()) {
			this._iconName = 'tier1:arrow-collapse-small';
			this.accordionState = 'open';
		} else {
			this._iconName = 'tier1:arrow-expand-small';
			this.accordionState = 'closed';
		}
	}

	_getHideDescriptionClass(_hideModuleDescription) {
		return _hideModuleDescription ? 'hide-description' : '';
	}

	_openModule(_moduleStartOpen) {
		if (_moduleStartOpen) {
			this.shadowRoot.querySelector('d2l-labs-accordion-collapse').setAttribute('opened', '');
		}
	}

	_setUpChildrenLoadingTracker(subEntities) {
		if (!subEntities) {
			return {};
		}

		return subEntities.reduce((acc, { href }) => {
			let hasLoaded = false;
			if (this._childrenLoadingTracker && this._childrenLoadingTracker[href]) {
				hasLoaded = this._childrenLoadingTracker[href];
			}
			return {
				...acc,
				[href]: hasLoaded
			};
		}, {});
	}

	checkIfChildrenDoneLoading(contentLoadedEvent) {
		const childHref = contentLoadedEvent.detail.href;

		if (!this._childrenLoadingTracker || !this._childrenLoading) {
			return;
		}

		if (this._childrenLoadingTracker[childHref] !== undefined) {
			this._childrenLoadingTracker[childHref] = true;
			contentLoadedEvent.stopPropagation();
		}

		if (!Object.values(this._childrenLoadingTracker).some(loaded => !loaded)) {
			this._childrenLoading = false;
			this.dispatchEvent(new CustomEvent('d2l-content-entity-loaded', {detail: { href: this.href}}));
		}
	}

	// This function is for determining if the module should fire off an "I'm loaded" event before its
	// children are finished loading. Two scenarios where this happens:
	// 1. The module has no children
	// 2. The module has children and does not start open
	_checkForEarlyLoadEvent(entity, subEntities, _moduleStartOpen) {
		if (entity && subEntities && (subEntities.length <= 0 || !_moduleStartOpen)) {
			this.dispatchEvent(new CustomEvent('d2l-content-entity-loaded', {detail: { href: this.href}}));
		}
	}

	_showChildSkeletons(showLoadingSkeleton, _childrenLoading) {
		return showLoadingSkeleton || _childrenLoading;
	}

	_onHeaderFocus() {
		this.headerFocused = true;
	}

	_onHeaderBlur() {
		this.headerFocused = false;
	}

	_onLaunchModuleButtonClick() {
		this.currentActivity = this.entity.getLinkByRel('self').href;
		this._contentObjectClick();
	}

	_checkModuleHeaderActive(currentActivity, entity, _hideModuleDescription) {
		if (entity && entity.getLinkByRel) {
			return entity.getLinkByRel('self').href === currentActivity && !_hideModuleDescription;
		} else {
			return false;
		}
	}

	_getTabIndex(showDates) {
		return showDates ? '0' : '-1';
	}
}
customElements.define(D2LOuterModule.is, D2LOuterModule);
