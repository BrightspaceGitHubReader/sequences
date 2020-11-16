import '@polymer/polymer/polymer-legacy.js';
import 'd2l-polymer-siren-behaviors/store/entity-behavior.js';
import 'd2l-colors/d2l-colors.js';
import 'd2l-typography/d2l-typography.js';
import '../d2l-sequence-navigator/d2l-sequence-navigator.js';
import '../d2l-sequence-navigator/d2l-lesson-header.js';
import '../d2l-sequence-navigator/d2l-sequence-end.js';
import '../localize-behavior.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class';

class D2LSequenceViewerSidebar extends mixinBehaviors([
	D2L.PolymerBehaviors.Siren.EntityBehavior,
	D2L.PolymerBehaviors.Sequences.LocalizeBehavior
], PolymerElement) {
	static get template() {
		return html`
		<style>
			#sidebar {
				height: 100%;
				width: 100%;
				display: flex;
				flex-direction: column;
			}
			#content {
				flex: 1;
				overflow-y: auto;
				min-width: 250px;
			}
			.m-module-heading {
				display: flex;
				justify-content: center;
				align-items: center;
				background-color: var(--d2l-asv-primary-color);
				min-width: 238px;
				padding: 8px 20px;
			}
			.m-module-heading:hover {
				background-color: var(--d2l-asv-header-hover-color);
			}
			div.border {
				border-radius: 6px;
				width: 100%;
				height: 100%;
			}
			.m-module-heading:focus,
			.m-module-heading:focus-within div.border {
				box-shadow: 0 0 0 2px var(--d2l-asv-text-color);
			}
			:host([header-active]) .m-module-heading {
				background-color: var(--d2l-asv-header-hover-color);
			}
		</style>
		<div id="sidebar">
			<div class="m-module-heading">
				<div class="border">
					<d2l-lesson-header id="sidebarHeader"
						href="[[rootHref]]"
						current-activity="{{href}}"
						token="[[token]]">
					</d2l-lesson-header>
				</div>
			</div>
			<div id="content">
				<d2l-sequence-navigator
					href="{{href}}"
					token="[[token]]"
					role="navigation"
					data-asv-css-vars="[[dataAsvCssVars]]"
					show-loading-skeleton="[[showLoadingSkeleton]]"
					is-sidebar
				>
					<d2l-sequence-end
						href="[[_sequenceEndHref]]"
						token="[[token]]"
						current-activity="{{href}}"
						text="[[localize('endOfSequence')]]"
						slot="end-of-unit"
					/>
				</d2l-sequence-navigator>
			</div>
		</div>
		`;
	}

	_getRootHref(entity) {
		const rootLink = entity && entity.getLinkByRel('https://sequences.api.brightspace.com/rels/sequence-root');
		return rootLink && rootLink.href || '';
	}

	_isHeaderActive(href, rootHref) {
		return rootHref === href;
	}

	_getSequenceEndHref(entity) {
		const endOfSequenceLink = entity && entity.getLinkByRel('https://sequences.api.brightspace.com/rels/end-of-sequence');
		return endOfSequenceLink && endOfSequenceLink.href || '';
	}

	static get is() {
		return 'd2l-sequence-viewer-sidebar';
	}
	static get properties() {
		return {
			href: {
				type: String,
				reflectToAttribute: true,
				notify: true
			},
			token: {
				type: String
			},
			dataAsvCssVars: {
				type: String
			},
			showLoadingSkeleton: {
				type: Boolean,
				value: false
			},
			rootHref: {
				type: String,
				computed: '_getRootHref(entity)'
			},
			headerActive: {
				type: Boolean,
				computed: '_isHeaderActive(href, rootHref)',
				reflectToAttribute: true
			},
			_sequenceEndHref: {
				type: String,
				computed: '_getSequenceEndHref(entity)'
			}
		};
	}
}
customElements.define(D2LSequenceViewerSidebar.is, D2LSequenceViewerSidebar);
