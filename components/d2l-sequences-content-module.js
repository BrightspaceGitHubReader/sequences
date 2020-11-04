import './d2l-sequences-module-name.js';
import '@brightspace-ui/core/components/html-block/html-block.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import 'd2l-typography/d2l-typography.js';

export class D2LSequencesContentModule extends mixinBehaviors([
	D2L.PolymerBehaviors.Siren.EntityBehavior,
	D2L.PolymerBehaviors.Siren.SirenActionBehaviorImpl
], PolymerElement) {
	static get template() {
		return html`
		<style include="d2l-typography">
		:host {
			display: block;
		}

		.d2l-module-container {
			max-width: 678px;
			margin: auto;
		}
		.d2l-sequences-module-name {
			border-bottom: 1px solid #ddd;
			padding-bottom: 30px;
			font-weight: 500;
			margin-bottom: 10px;
			padding-top: 2em;
		}
		</style>
		<div class="d2l-module-container d2l-typography">
			<h1 class="d2l-sequences-module-name d2l-heading-1">
				<d2l-sequences-module-name href="[[href]]" token="[[token]]"></d2l-sequences-module-name>
			</h1>

			<d2l-html-block>
				<template id="description">
				</template>
			</d2l-html-block>
		</div>
`;
	}

	static get is() {
		return 'd2l-sequences-content-module';
	}

	static get contentModuleClass() {
		return 'sequence-description';
	}

	static get observers() {
		return [
			'_getDescription(entity)'
		];
	}

	_getDescription(entity) {
		if (!entity || !entity.properties || !entity.properties.description) {
			return;
		}

		this.$.description.innerHTML = entity.properties.description;
	}
}

customElements.define(D2LSequencesContentModule.is, D2LSequencesContentModule);
