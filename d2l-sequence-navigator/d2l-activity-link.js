import { CompletionStatusMixin } from '../mixins/completion-status-mixin.js';
import { PolymerASVLaunchMixin } from '../mixins/polymer-asv-launch-mixin.js';
import { formatAvailabilityDateString } from '../util/util.js';
import './d2l-completion-status.js';
import './d2l-completion-requirement.js';
import '@brightspace-ui/core/components/colors/colors.js';
import '@brightspace-ui/core/components/icons/icon.js';
import '@brightspace-ui/core/components/tooltip/tooltip.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
/*
@memberOf window.D2L.Polymer.Mixins;
@mixes CompletionStatusMixin
@mixes PolymerASVLaunchMixin
*/

class D2LActivityLink extends PolymerASVLaunchMixin(CompletionStatusMixin()) {
	static get template() {
		return html`
		<style>
			:host {
				--d2l-icon-padding: 15px;
				--title-container-padding: 5px;
				display: block;
				@apply --d2l-body-compact-text;
			}

			#content-container:focus,
			#content-container:focus-within {
				outline: none;
				box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px var(--d2l-color-celestine);
				background-color: var(--d2l-color-gypsum);
			}

			#content-container:focus,
			#content-container:focus-within a {
				color: var(--d2l-color-celestine-minus-1);
			}

			#content-container:focus,
			#content-container:focus-within d2l-icon {
				color: var(--d2l-color-celestine-minus-1);
			}

			:host > div {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
			}

			:host([show-loading-skeleton]) {
				cursor: unset;
			}

			:host([show-underline]) > #outer-container {
				border-bottom: 1px solid var(--d2l-color-mica);
			}

			#outer-container {
				border-bottom: 1px solid transparent;
				display: flex;
				flex-direction: row;
				flex: 1;
				padding-bottom: 6px;
			}

			#content-container {
				flex: 1;
				cursor: pointer;
				padding: 12px;
				border-radius: 6px;
				border: 2px solid transparent;
			}

			#title-and-completion {
				display: flex;
				justify-content: space-between;
				align-items: center;
			}

			:host([is-current-activity]) #content-container,
			#content-container:hover {
				background: var(--d2l-color-gypsum);
			}

			:host([is-current-activity]) #content-container a,
			#content-container:hover a {
				color: var(--d2l-color-celestine-minus-1);
			}

			:host([is-current-activity]) #content-container d2l-icon,
			#content-container:hover d2l-icon {
				color: var(--d2l-color-celestine-minus-1);
			}

			#title-container {
				display: inline-flex;
				align-items: center;
				word-break: break-all;
				padding-right: var(--title-container-padding);
				width: 90%;
			}
			:host(:dir(rtl)) #title-container {
				padding-right: initial;
				padding-left: var(--title-container-padding);
			}

			d2l-icon,
			a,
			d2l-completion-requirement,
			d2l-completion-status {
				vertical-align: top;
			}

			.d2l-activity-link-title {
				word-break: break-word;
				display: flex;
				flex: 1;
				flex-direction: column;
			}

			a {
				@apply --d2l-body-compact-text;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				max-height: 3.0rem;
				-webkit-line-clamp: 2; /* number of lines to show */
				outline: none;
				text-decoration: none;
				color: var(--d2l-color-celestine);
			}

			a.d2l-activity-link-one-line {
				-webkit-line-clamp: 1; /* number of lines to show */
			}

			d2l-completion-requirement {
				--d2l-activity-link-subtext-color: var(--d2l-color-tungsten);
				color: var(--d2l-activity-link-subtext-color);
				margin: 0;
			}

			d2l-icon {
				padding-right: var(--d2l-icon-padding);
				color: var(--d2l-color-celestine);
				min-width: 18px;
			}
			:host(:dir(rtl)) d2l-icon {
				padding-right: initial;
				padding-left: var(--d2l-icon-padding);
			}

			d2l-completion-status {
				color: var(--d2l-color-ferrite);
			}

			#date-container {
				display: flex;
				justify-content: space-between;
			}

			#due-date, #availability-dates {
				color: var(--d2l-color-ferrite);
				font-size: 0.65rem;
				font-weight: var(--d2l-body-small-text_-_font-weight);
				line-height: var(--d2l-body-small-text_-_line-height);
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
				animation: loadingShimmer 1.8s ease-in-out infinite;
				-webkit-animation: webkitLoadingShimmer 1.8s ease-in-out infinite;
				height: 24px;
				width: 70%;
				border-radius: 8px;
				background-color: var(--d2l-color-sylvite);
				overflow: hidden;
				position: relative;
			}
		</style>
		<div id="outer-container">
			<template is="dom-if" if="[[showLoadingSkeleton]]">
				<div id="skeleton" class="skeleton"></div>
			</template>
			<template is="dom-if" if="[[!showLoadingSkeleton]]">
				<div id="content-container" on-click="setCurrent" tabindex="0">
					<div id="title-and-completion">
						<div id="title-container">
							<template is="dom-if" if="[[hasIcon]]">
								<d2l-icon icon="[[_getIconSetKey(entity)]]"></d2l-icon>
							</template>
							<div class="d2l-activity-link-title">
								<a class$="[[completionRequirementClass]]" href="javascript:void(0)" tabindex="-1">
									[[entity.properties.title]]
								</a>
								<d2l-completion-requirement href="[[href]]" token="[[token]]">
								</d2l-completion-requirement>
							</div>
						</div>
						<d2l-completion-status href="[[href]]" token="[[token]]"></d2l-completion-status>
					</div>
					<div id="date-container">
						<div id="due-date"></div>
						<div id="availability-dates" tabindex$="[[_getTabIndex(_showDates)]]" role="note">[[_availabilityDateString]]</div>
						<d2l-tooltip
							for="availability-dates"
							boundary="[[_availDateTooltipBoundary]]"
						>[[_availabilityDateTooltip]]</d2l-tooltip>
					</div>
				</div>
			</template>
		</div>
`;
	}

	static get is() {
		return 'd2l-activity-link';
	}
	static get properties() {
		return {
			currentActivity: {
				type: String,
				value: '',
				notify: true
			},
			completionRequirementClass: {
				type: String,
				computed: '_getCompletionRequirementClass(entity)'
			},
			hasIcon: {
				type: Boolean,
				computed: '_hasIcon(entity)'
			},
			completionStatus: {
				type: String,
				computed: '_getCompletionStatus(entity)',
			},
			showLoadingSkeleton: {
				type: Boolean,
				value: false,
				reflectToAttribute: true
			},
			showUnderline: {
				type: Boolean,
				value: false,
				reflectToAttribute: true
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
		return [
			'onCurrentActivityChanged(currentActivity, entity)',
			'_onEntityLoaded(entity)'
		];
	}

	ready() {
		super.ready();
		this.addEventListener('keypress', this._onKeyPress);
	}

	_onKeyPress(event) {
		if (event.key !== 'Enter') {
			return;
		}
		this.setCurrent();
	}

	setCurrent() {
		if (!this.isSidebar) {
			this._contentObjectClick();
		}
		this.currentActivity = this.entity && this.entity.getLinkByRel('self').href;
		this.dispatchEvent(new CustomEvent('sequencenavigator-d2l-activity-link-current-activity', {detail: { href: this.href}}));
	}

	onCurrentActivityChanged(currentActivity, entity) {
		if (currentActivity && entity) {
			this.dispatchEvent(new CustomEvent('activitySelected', { detail:{ activityHref: currentActivity }, composed: true }));
		}
	}

	_hasIcon(entity) {
		const tierClass = 'tier1';
		return entity && entity.getSubEntityByClass(tierClass);
	}

	_getIconSetKey(entity) {
		const tierClass = 'tier1';
		return (entity.getSubEntityByClass(tierClass)).properties.iconSetKey;
	}

	_getCompletionRequirementClass(entity) {
		const completionRequirement = this._getCompletionRequirement(entity);
		switch (completionRequirement) {
			case 'exempt':
			case 'optional':
				return 'd2l-activity-link-one-line';
		}
		return '';
	}

	_getIsCurrentActivity(entity, currentActivity) {
		return entity && entity.getLinkByRel && entity.getLinkByRel('self').href === currentActivity;
	}

	_onEntityLoaded(entity) {
		if (entity) {
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
customElements.define(D2LActivityLink.is, D2LActivityLink);
