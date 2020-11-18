/**
'd2l-lesson-header'
@demo demo/index.html
*/
import { CompletionStatusMixin } from '../mixins/completion-status-mixin.js';
import { ASVFocusWithinMixin } from '../mixins/asv-focus-within-mixin.js';
import { formatAvailabilityDateString } from '../util/util.js';
import 'd2l-offscreen/d2l-offscreen.js';
import '@brightspace-ui/core/components/colors/colors.js';
import 'd2l-typography/d2l-typography.js';
import '@brightspace-ui/core/components/meter/meter-circle.js';
import '@brightspace-ui/core/components/tooltip/tooltip.js';
import 'd2l-progress/d2l-progress.js';
import '@brightspace-ui/core/components/icons/icon.js';
import { isColorAccessible } from '@brightspace-ui/core/helpers/contrast.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

/*
@memberOf D2L.Polymer.Mixins;
@mixes CompletionStatusMixin
@mixes D2L.Polymer.Mixins.ASVFocusWithinMixin
*/
class D2LLessonHeader extends ASVFocusWithinMixin(CompletionStatusMixin()) {
	static get template() {
		return html`
		<style>
		:host {
			--d2l-lesson-header-text-color: var(--d2l-asv-text-color);
			--d2l-lesson-header-background-color: transparent;
			--d2l-meter-size: 48px;
			--module-completion-count-padding: 3px;
			width: calc(100% - 20px);
			height: calc(100% - 18px);
			background-color: var(--d2l-lesson-header-background-color);
			color: var(--d2l-lesson-header-text-color);
			padding: 9px 10px;
			display: block;
		}

		a:focus {
			outline: none;
		}

		.module-title {
			@apply --d2l-heading-3;
			font-size: 24px;
			overflow: hidden;
			word-wrap: break-word;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2; /* number of lines to show */
			max-height: 3rem; /* fallback */
			margin-top: 0px;
			margin-bottom: 0px;
		}

		.module-completion-count {
			@apply --d2l-body-small-text;
			color: var(--d2l-lesson-header-text-color);
			text-align: right;
			padding-top: 10px;
			padding-right: var(--module-completion-count-padding);
		}

		:host(:dir(rtl)) .module-completion-count {
			padding-right: initial;
			padding-left: var(--module-completion-count-padding);
			text-align: left;
		}

		.d2l-header-lesson-link,
		.d2l-header-lesson-link:hover {
			cursor: pointer;
			color: var(--d2l-lesson-header-text-color);
			text-decoration: none;
		}

		progress.d2l-progress {
			@apply --d2l-progress;
			background-color: var(--d2l-color-gypsum);
			height:12px;
		}

		/* this is necessary to avoid white bleed over rounded corners in chrome and safari */
		progress.d2l-progress::-webkit-progress-bar {
			@apply --d2l-progress-webkit-progress-bar;
		}

		/* strangely, comma separating the selectors for these pseudo-elements causes them to break */
		progress.d2l-progress::-webkit-progress-value {
			@apply --d2l-progress-webkit-progress-value;
			background-color: var(--d2l-color-celestine);
			border:none;
		}

		/* note: unable to get firefox to animate the width... seems animation is not implemented for progress in FF */
		progress.d2l-progress::-moz-progress-bar {
			@apply --d2l-progress-moz-progress-bar;
			background-color: var(--d2l-color-celestine);
			border:none;
		}

		progress.d2l-progress::-ms-fill {
			@apply --d2l-progress-ms-fill;
			border: 1px solid transparent;
			border-radius: 10px;
			/*Added default value since --d2l-color-celestine doesn't work on Edge
			https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/12837456/*/
			background-color: var(--d2l-color-celestine, #006fbf);
		}

		:host(.hide-description) .d2l-header-lesson-link,
		:host(.hide-description) .d2l-header-lesson-link:hover {
			cursor:default;
		}

		:host(.d2l-asv-current) progress.d2l-progress {
			background-color: transparent;
			border: 1px solid var(--d2l-asv-selected-text-color);
			box-shadow: none;
		}

		:host(.d2l-asv-current) progress.d2l-progress::-webkit-progress-value {
			background-color: var(--d2l-asv-selected-text-color);
		}

		:host(.d2l-asv-current) progress.d2l-progress::-moz-progress-bar {
			background-color: var(--d2l-asv-selected-text-color);
		}

		:host(.d2l-asv-current) progress.d2l-progress::-ms-fill {
			background-color: var(--d2l-asv-selected-text-color, #fff);
		}

		/* Added light-theme id as a workaround for Edge issue with variables in -ms-fill
		https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/12837456/ */
		:host(.d2l-asv-current) progress.d2l-progress#light-theme::-ms-fill {
			background-color: var(--d2l-asv-selected-text-color, #565a5c);
		}

		:host(.d2l-asv-focus-within:not(.hide-description)) progress.d2l-progress,
		:host(:hover:not(.hide-description)) progress.d2l-progress {
			background-color: transparent;
			border: 1px solid var(--d2l-color-ferrite);
			box-shadow: none;
		}

		:host(.d2l-asv-focus-within:not(.hide-description)) progress.d2l-progress::-webkit-progress-value,
		:host(:hover:not(.hide-description)) progress.d2l-progress::-webkit-progress-value {
			background-color: var(--d2l-color-ferrite);
		}

		:host(.d2l-asv-focus-within:not(.hide-description)) progress.d2l-progress::-moz-progress-bar,
		:host(:hover:not(.hide-description)) progress.d2l-progress::-moz-progress-bar {
			background-color: var(--d2l-color-ferrite);
		}

		:host(.d2l-asv-focus-within:not(.hide-description)) progress.d2l-progress::-ms-fill,
		:host(:hover:not(.hide-description)) progress.d2l-progress::-ms-fill {
			background-color: var(--d2l-color-ferrite, #565a5c);
		}

		div.title-container {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		div.title {
			width: calc(100% - var(--d2l-meter-size));
		}

		d2l-meter-circle {
			height: var(--d2l-meter-size);
			min-height: var(--d2l-meter-size);
			width: var(--d2l-meter-size);
			min-width: var(--d2l-meter-size);
		}

		d2l-icon {
			color: var(--d2l-lesson-header-text-color);
		}

		div.unit-info {
			font-size: 14px;
		}

		div.date-container {
			padding-top: 4px;
			display: flex;
			justify-content: space-between;
		}

		div.date-container.has-dates {
			border-top: 1px solid white;
		}

		div.date-container > div {
			font-size: 0.65rem;
		}
		</style>

		<siren-entity href="[[_moduleProgressHref]]" token="[[token]]" entity="{{_moduleProgress}}"></siren-entity>
		<a href="javascript:void(0)" class="d2l-header-lesson-link" on-click="_onHeaderClicked">
			<div>
				<div class="title-container">
					<div class="title">
						<template is="dom-if" if="[[_useModuleIndex]]">
							<div class="unit-info">
								<span>[[_moduleTitle]]</span>
								<d2l-icon icon="tier1:bullet"></d2l-icon>
								<span>[[_completionProgress]]</span>
							</div>
						</template>
						<span class="module-title">[[entity.properties.title]]</span>
					</div>
					<template is="dom-if" if="[[_useNewProgressBar]]">
						<d2l-meter-circle
							class="d2l-progress"
							value="[[completionCount.completed]]"
							max="[[completionCount.total]]"
							foreground-light$="[[_lightMeter]]">
						</d2l-meter-circle>
					</template>
				</div>
				<div class$="[[_getDateContainerClasses(_showDates)]]">
					<div id="due-date"></div>
					<div id="availability-dates">[[_availabilityDateString]]</div>
					<d2l-tooltip for="availability-dates">[[_availabilityDateTooltip]]</d2l-tooltip>
				</div>
			</div>
			<template is="dom-if" if="[[!_useNewProgressBar]]">
				<progress id$="[[isLightTheme()]]" class="d2l-progress" value="[[percentCompleted]]" max="100"></progress>
				<div class="module-completion-count" aria-hidden="true">[[localize('sequenceNavigator.completedMofN', 'completed', completionCompleted, 'total', completionTotal)]]</div>
			</template>
			<div><d2l-offscreen>[[localize('sequenceNavigator.requirementsCompleted', 'completed', completionCompleted, 'total', completionTotal)]]</d2l-offscreen></div>
		</a>
`;
	}

	static get is() {
		return 'd2l-lesson-header';
	}
	static get properties() {
		return {
			class: {
				type: String,
				reflectToAttribute: true,
				computed:'_getHeaderClass(currentActivity, entity, focusWithin)'
			},
			currentActivity: {
				type: String,
				value: '',
				notify: true,
				observer: '_lightenMeter'
			},
			_moduleProgressHref: {
				type: String,
				computed: '_getModuleProgressHref(entity)'
			},
			_useModuleIndex: {
				type: Boolean,
				value: false,
				computed: '_checkCompletionProgress(_completionProgress)'
			},
			_moduleIndex: {
				type: Number,
				computed: '_getModuleIndex(_moduleProgress.properties, entity.properties)'
			},
			_siblingModules: {
				type: Number,
				computed: '_getSiblingModules(_moduleProgress.properties, entity.properties)'
			},
			_moduleTitle: {
				type: String,
				computed: '_getModuleTitle(entity.properties)'
			},
			_useNewProgressBar: {
				type: Boolean,
				value: false,
				computed: '_getUseNewProgressBar(entity.properties)'
			},
			_lightMeter: {
				type: Boolean,
				value: false
			},
			_selfLink: {
				type: String,
				value: '',
				computed: '_getSelfLink(entity)',
				observer: '_lightenMeter'
			},
			_completionProgress: {
				type: String,
				computed: '_getCompletionProgress(entity.properties, _moduleProgress.properties, _moduleIndex, _siblingModules)'
			},
			_moduleProgress: {
				type: Object
			},
			_showDates: {
				type: Boolean,
				value: false,
				computed: '_getShowDates(entity.properties)'
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

	_lightenMeter() {
		const style = getComputedStyle(this);
		const bkgdColour = style.getPropertyValue('--d2l-asv-primary-color').trim();
		const ferrite = style.getPropertyValue('--d2l-color-ferrite').trim();

		this._lightMeter = bkgdColour !== 'transparent' &&
			bkgdColour !== '' &&
			!isColorAccessible(bkgdColour, ferrite);
	}

	_getHeaderClass(currentActivity, entity, focusWithin) {
		const selfLink = entity && entity.getLinkByRel('self').href;
		const selected = currentActivity === selfLink;
		let trueClasses = this._getTrueClass(focusWithin, selected);
		if (entity && entity.hasClass('hide-description')) {
			trueClasses += ' hide-description';
		}
		return trueClasses;
	}

	_getSelfLink(entity) {
		return entity && entity.getLinkByRel('self').href || '';
	}

	_onHeaderClicked() {
		if (this.entity && this.entity.hasClass('hide-description')) {
			return;
		}
		this.currentActivity = this._selfLink;
	}

	isLightTheme() {
		var styles = JSON.parse(document.getElementsByTagName('html')[0].getAttribute('data-asv-css-vars'));
		if (styles && styles['--d2l-asv-selected-text-color'] === 'var(--d2l-color-ferrite)') {
			return 'light-theme';
		}
		return;
	}

	_getCompletionProgress(entityProperties, moduleProperties, _moduleIndex, _siblingModules) {
		if (entityProperties && entityProperties.completionProgressLangTerm) {
			return entityProperties.completionProgressLangTerm;
		} else if (moduleProperties && moduleProperties.completionProgressLangTerm) {
			return moduleProperties.completionProgressLangTerm;
		} else if (_moduleIndex && _siblingModules) {
			return this.localize('sequenceNavigator.currentModule', 'current', _moduleIndex, 'total', _siblingModules);
		} else {
			return '';
		}
	}

	_checkCompletionProgress(completionProgress) {
		return completionProgress && completionProgress !== '';
	}

	_getModuleIndex(moduleProperties, entityProperties) {
		if (moduleProperties && moduleProperties.moduleIndex) {
			return moduleProperties.moduleIndex;
		} else if (entityProperties && entityProperties.moduleIndex) {
			return entityProperties.moduleIndex;
		} else {
			return null;
		}
	}

	_getModuleTitle(properties) {
		return properties && properties.courseName;
	}

	_getSiblingModules(moduleProperties, entityProperties) {
		if (moduleProperties && moduleProperties.numberOfSiblingModules) {
			return moduleProperties.numberOfSiblingModules;
		} else if (entityProperties && entityProperties.numberOfSiblingModules) {
			return entityProperties.numberOfSiblingModules;
		} else {
			return null;
		}
	}

	_getUseNewProgressBar(properties) {
		return properties && properties.useNewProgressBar;
	}

	_getModuleProgressHref(entity) {
		const rootLink = entity && entity.getLinkByRel('module-progress-info');
		return rootLink && rootLink.href || '';
	}

	_getShowDates(properties) {
		if (!properties) {
			return false;
		}

		// TODO: Add due date to this check
		const { startDate, endDate } = properties;

		return startDate || endDate;
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

	_getDateContainerClasses(showDates) {
		const classes = ['date-container'];
		if (showDates) {
			classes.push('has-dates');
		}

		return classes.join(' ');
	}

}

window.customElements.define(D2LLessonHeader.is, D2LLessonHeader);
