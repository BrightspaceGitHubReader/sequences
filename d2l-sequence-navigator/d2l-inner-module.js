import './d2l-activity-link.js';
import { CompletionStatusMixin } from '../mixins/completion-status-mixin.js';
import { PolymerASVLaunchMixin } from '../mixins/polymer-asv-launch-mixin.js';
import { formatAvailabilityDateString } from '../util/util.js';
import '@brightspace-ui/core/components/colors/colors.js';
import '@brightspace-ui/core/components/icons/icon.js';
import '@brightspace-ui/core/components/tooltip/tooltip.js';
import 'd2l-offscreen/d2l-offscreen.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
/*
@memberOf window.D2L.Polymer.Mixins;
@mixes D2L.Polymer.Mixins.CompletionStatusMixin
@mixes D2L.Polymer.Mixins.PolymerASVLaunchMixin
*/

class D2LInnerModule extends PolymerASVLaunchMixin(CompletionStatusMixin()) {
	static get template() {
		return html`
		<style>
			:host {
				display: block;
				@apply --d2l-body-compact-text;
				color: var(--d2l-color-celestine);
			}

			#module-header:focus,
			#module-header:focus-within {
				outline: none;
				background-color: var(--d2l-color-gypsum);
				box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px var(--d2l-color-celestine);
			}

			#module-header:focus,
			#module-header:focus-within d2l-icon {
				color: var(--d2l-color-celestine-minus-1);
			}

			#module-header:focus,
			#module-header:focus-within a {
				color: var(--d2l-color-celestine-minus-1);
			}

			#title-container {
				display: inline-flex;
				align-items: center;
			}

			#module-header {
				cursor: pointer;
				padding: 12px;
				border-radius: 6px;
				border: 2px solid transparent;
			}

			:host([is-current-activity]) #module-header,
			#module-header:hover {
				background: var(--d2l-color-gypsum);
			}

			:host([is-current-activity]) #module-header a,
			#module-header:hover a {
				color: var(--d2l-color-celestine-minus-1);
			}

			:host([is-current-activity]) #module-header d2l-icon,
			#module-header:hover d2l-icon {
				color: var(--d2l-color-celestine-minus-1);
			}

			#module-header a {
				text-decoration: none;
				color: var(--d2l-color-celestine);
				outline: none;
				display: flex;
			}

			d2l-icon {
				padding-right: 15px;
				color: var(--d2l-color-celestine);
				min-width: 18px;
			}

			.count-status {
				color: var(--d2l-color-ferrite);
			}

			#module-header.hide-description,
			#module-header.hide-description > a {
				cursor: default;
			}

			#title-and-completion, #date-container {
				display: flex;
				justify-content: space-between;
				flex-grow: 1;
			}

			#module-header #date-container d2l-tooltip {
				color: white;
			}

			#due-date, #availability-dates {
				color: var(--d2l-color-ferrite);
				font-size: 0.65rem;
				font-weight: var(--d2l-body-small-text_-_font-weight);
				line-height: var(--d2l-body-small-text_-_line-height);
			}

			ol {
				list-style-type: none;
				border-collapse: collapse;
				margin: 0;
				padding: 0 18px 0 30px;
			}

			li {
				padding-top: 6px;
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

			#skeleton {
				display: none;
			}

			:host([show-loading-skeleton]) #skeleton {
				animation: loadingShimmer 1.8s ease-in-out infinite;
				-webkit-animation: webkitLoadingShimmer 1.8s ease-in-out infinite;
				display: block;
				background-color: var(--d2l-color-sylvite);
				overflow: hidden;
				position: relative;
				height: 96px;
				width: 100%;
				border-radius: 8px;
			}

			:host([show-loading-skeleton]) #module-header,
			:host([show-loading-skeleton]) ol {
				display: none;
			}
		</style>
		<div id="skeleton"></div>
		<div id="module-header" class$="[[_getHideDescriptionClass(_hideDescription)]]" on-click="_onHeaderClicked" tabindex="0">
			<div id="title-and-completion">
				<div id="title-container">
					<d2l-icon icon="tier1:folder"></d2l-icon>
					<a href="javascript:void(0)" tabindex="-1">[[entity.properties.title]]</a>
				</div>
				<span class="count-status" aria-hidden="true">
					[[localize('sequenceNavigator.countStatus', 'completed', completionCompleted, 'total', completionTotal)]]
				</span>
			</div>
			<div id="date-container">
				<div id="due-date">[[_dueDate]]</div>
				<div id="availability-dates" tabindex$="[[_getTabIndex(_showDates)]]" role="note">[[_availabilityDateString]]</div>
				<d2l-tooltip
					for="availability-dates"
					boundary="[[_availDateTooltipBoundary]]"
				>[[_availabilityDateTooltip]]</d2l-tooltip>
			</div>
		</div>
		<ol>
			<template is="dom-repeat" items="[[subEntities]]" as="childLink">
				<li>
					<d2l-activity-link
						href="[[childLink.href]]"
						token="[[token]]"
						current-activity="{{currentActivity}}"
						on-sequencenavigator-d2l-activity-link-current-activity="childIsActiveEvent"
						on-d2l-content-entity-loaded="checkIfChildrenDoneLoading"
						show-underline="[[_nextActivitySiblingIsActivity(subEntities, index)]]"
						is-sidebar="[[isSidebar]]"
					></d2l-activity-link>
				</li>
			</template>
		</ol>
`;
	}

	static get is() {
		return 'd2l-inner-module';
	}
	static get properties() {
		return {
			currentActivity: {
				type: String,
				value: '',
				notify: true
			},
			_hideDescription: {
				type: Boolean,
				computed: '_getHideDescription(entity)'
			},
			hasCurrentActivity: {
				type: Boolean,
				value: false
			},
			subEntities: {
				type: Array,
				computed: 'getSubEntities(entity)'
			},
			hasActiveChild: {
				type: Boolean,
				computed: '_getHasActiveChild(entity, currentActivity)',
				reflectToAttribute: true
			},
			showLoadingSkeleton: {
				type: Boolean,
				value: false,
				reflectToAttribute: true
			},
			_childrenLoading: {
				type: Boolean,
				value: true
			},
			_childrenLoadingTracker: {
				type: Object,
				computed: '_setUpChildrenLoadingTracker(subEntities)'
			},
			isSidebar: {
				type: Boolean,
				reflectToAttribute: true
			},
			isCurrentActivity: {
				type: Boolean,
				reflectToAttribute: true,
				computed: '_getIsCurrentActivity(entity, currentActivity)'
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
			_availabilityDateString: {
				type: String,
				value: '',
				computed: '_getAvailabilityDateString(entity.properties)'
			},
			_availabilityDateTooltip: {
				type: String,
				value: '',
				computed: '_getAvailabilityDateTooltip(entity.properties)'
			}
		};
	}

	static get observers() {
		return ['_checkIfNoChildren(entity, subEntities)'];
	}

	_nextActivitySiblingIsActivity(subEntities, index) {
		if (index >= subEntities.length) {
			return false;
		}

		const nextSibling = subEntities[index + 1];

		return this._isActivity(nextSibling);
	}

	_isActivity(link) {
		return link && link.hasClass('sequenced-activity');
	}

	getSubEntities(entity) {
		return entity && entity.getSubEntities()
			.filter(subEntity => (subEntity.hasClass('sequenced-activity') && subEntity.hasClass('available')) || (subEntity.href && subEntity.hasClass('sequence-description')))
			.map(this._getHref);
	}

	_getHideDescription(entity) {
		return Boolean(entity) && entity.hasClass('hide-description');
	}

	_getHref(entity) {
		return entity && entity.getLinkByRel && entity.getLinkByRel('self') || entity || '';
	}

	_getIsCurrentActivity(entity, currentActivity) {
		return entity && entity.getLinkByRel && entity.getLinkByRel('self').href === currentActivity;
	}

	_onHeaderClicked() {
		if (this._hideDescription) {
			return;
		}
		this.currentActivity = this.entity.getLinkByRel('self').href;
		this._contentObjectClick();
	}

	childIsActiveEvent() {
		this.dispatchEvent(new CustomEvent('sequencenavigator-d2l-inner-module-current-activity', {detail: { href: this.href}}));
	}

	isLast(entities, index) {
		return entities.length <= index + 1;
	}

	_getHideDescriptionClass(hideDescription) {
		return hideDescription ? 'hide-description' : '';
	}

	_getHasActiveChild(entity, currentActivity) {
		return Boolean(entity) && entity.entities.some(subEntity => subEntity.href === currentActivity);
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

		if (!this._childrenLoadingTracker) {
			return;
		}

		if (this._childrenLoadingTracker[childHref] !== undefined) {
			this._childrenLoadingTracker[childHref] = true;
			contentLoadedEvent.stopPropagation();
		}

		if (this._childrenLoading && !Object.values(this._childrenLoadingTracker).some(loaded => !loaded)) {
			this._childrenLoading = false;
			this.dispatchEvent(new CustomEvent('d2l-content-entity-loaded', {detail: { href: this.href}}));
		}
	}

	_checkIfNoChildren(entity, subEntities) {
		if (entity
			&& subEntities
			&& subEntities.length <= 0
		) {
			this._childrenLoading = false;
			this.dispatchEvent(new CustomEvent('d2l-content-entity-loaded', {detail: { href: this.href}}));
		}
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

	_getTabIndex(showDates) {
		return showDates ? '0' : '-1';
	}
}
customElements.define(D2LInnerModule.is, D2LInnerModule);
