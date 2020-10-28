import 'd2l-loading-spinner/d2l-loading-spinner.js';
import '../mixins/d2l-sequences-automatic-completion-tracking-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import HypermediaHelper from '../helpers/hypermedia-helper.js';

export class D2LSequencesContentLink extends D2L.Polymer.Mixins.Sequences.AutomaticCompletionTrackingMixin() {
	static get template() {
		return html`
		<style>
			iframe {
				width: 100%;
				height: calc(100% - 12px);
				overflow: hidden;
			}
			.d2l-sequences-hide {
				visibility: hidden;
			}
			.d2l-sequences-scroll-container {
				-webkit-overflow-scrolling: touch;
				overflow-y: auto;
				height: 100%;
			}
			d2l-loading-spinner {
				position: fixed;
				top: 33%;
				left: 50%;
				background-color: rgba(255, 255, 255, 0.4);
				z-index: 9999;
				--d2l-loading-spinner-size: 75px;
			}
		</style>
		<d2l-loading-spinner id="spinner"></d2l-loading-spinner>
		<div class="d2l-sequences-scroll-container">
			<iframe id="content" class="d2l-sequences-hide" frameborder="0" scrolling="auto" src$="[[_linkLocation]]" allowfullscreen allow="microphone *; camera *; display-capture *; encrypted-media *;"></iframe>
		</div>
`;
	}

	static get is() {
		return 'd2l-sequences-content-link';
	}
	static get contentClass() {
		return HypermediaHelper.linkContentClass;
	}
	static get properties() {
		return {
			href: {
				type: String,
				reflectToAttribute: true,
				notify: true,
				observer: '_scrollToTop'
			},
			previousHref: {
				type: String
			},
			isUnloaded: {
				type: Boolean
			},
			_linkLocation: {
				type: String,
				computed: '_getLinkLocation(entity)'
			}
		};
	}
	static get observers() {
		return ['_render(entity)', '_unload(isUnloaded)'];
	}

	connectedCallback() {
		super.connectedCallback();
		this.multiPageNavListener = window.addEventListener('d2l-sequence-viewer-multipage-navigation', this._navigateMultiPageFile.bind(this));
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		window.removeEventListener('d2l-sequence-viewer-multipage-navigation', this.multiPageNavListener);
		window.postMessage(JSON.stringify({ handler: 'd2l.nav.reset' }), '*');
	}
	_scrollToTop() {
		window.top.scrollTo(0, 0);
	}

	_getLinkLocation(entity) {
		return HypermediaHelper.getLinkLocation(entity);
	}

	/* eslint no-unused-vars: 0 */
	_render(entity) {
		if (this._redirect) {
			this._redirect();
		}

		// iframe won't reload if the href doesn't change
		// so this prevents the spinner from covering it
		// forever
		if (this.href === this.previousHref) {
			return;
		}

		this.previousHref = this.href;

		const content = this.shadowRoot.getElementById('content');
		const spinner = this.shadowRoot.getElementById('spinner');

		// initially hide the content, show the spinner
		content.classList.add('d2l-sequences-hide');
		spinner.classList.remove('d2l-sequences-hide');

		content.onload = function() {
			content.classList.remove('d2l-sequences-hide');
			spinner.classList.add('d2l-sequences-hide');
		};
	}

	_unload(isUnloaded) {
		if (isUnloaded) {
			const contentFrame = this.shadowRoot.querySelector('#content');
			contentFrame.src = '';
		}
	}

	_navigateMultiPageFile(e) {
		const iframe = this.shadowRoot.querySelector('iframe');
		if (iframe && iframe.contentWindow) {
			iframe.contentWindow.postMessage(JSON.stringify({
				handler: 'd2l.nav.client',
				action: e.detail
			}), '*');
		}
	}
}
customElements.define(D2LSequencesContentLink.is, D2LSequencesContentLink);
