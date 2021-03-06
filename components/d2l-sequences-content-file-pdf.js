import '../mixins/d2l-sequences-automatic-completion-tracking-mixin.js';
import 'd2l-pdf-viewer/d2l-pdf-viewer.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
export class D2LSequencesContentFilePdf extends D2L.Polymer.Mixins.Sequences.AutomaticCompletionTrackingMixin() {
	static get template() {
		return html`
		<style>
			d2l-pdf-viewer {
				width: 100%;
				height: calc(100% - 12px);
				overflow: hidden;
			}
		</style>
		<d2l-pdf-viewer
			src="[[_fileLocation]]"
			loader="script"
			use-cdn
			enable-download="[[_enableDownload]]"
			enable-print="[[_enablePrint]]"
		>
		</d2l-pdf-viewer>
`;
	}

	static get is() {
		return 'd2l-sequences-content-file-pdf';
	}
	static get properties() {
		return {
			href: {
				type: String,
				reflectToAttribute: true,
				notify: true,
				observer: '_scrollToTop'
			},
			_fileLocation: String,
			title: String,
			_enableDownload: {
				type: Boolean,
				value: false
			},
			_enablePrint: {
				type: Boolean,
				value: false
			}
		};
	}
	static get observers() {
		return ['_setProperties(entity)'];
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		window.postMessage(JSON.stringify({ handler: 'd2l.nav.reset' }), '*');
	}

	_scrollToTop() {
		window.top.scrollTo(0, 0);
	}

	_setProperties(entity) {
		if (!entity) {
			return;
		}

		if (entity.properties) {
			const { title, canDownload, canPrint } = entity.properties;
			this.title = title;
			this._enableDownload = canDownload;
			this._enablePrint = canPrint;
		}

		try {
			const linkActivityHref = this._getLinkLocation(entity);
			if (linkActivityHref) {
				this._fileLocation = linkActivityHref;
			} else {
				const fileActivity = entity.getSubEntityByClass('file-activity');
				const file = fileActivity.getSubEntityByClass('file');
				const link = file.getLinkByClass('pdf') || file.getLinkByClass('embed') || file.getLinkByRel('alternate');
				this._fileLocation = link.href;
			}
		} catch (e) {
			this._fileLocation = '';
		}
	}
	_getLinkLocation(entity) {
		try {
			const linkActivity = entity.getSubEntityByClass('link-activity');
			const link = linkActivity.getLinkByRel('about');
			return link.href;
		} catch (e) {
			return '';
		}
	}
}
customElements.define(D2LSequencesContentFilePdf.is, D2LSequencesContentFilePdf);
