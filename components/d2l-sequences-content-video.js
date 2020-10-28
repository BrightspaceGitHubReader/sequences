import '@brightspace-ui-labs/media-player/media-player.js';
import '../mixins/d2l-sequences-automatic-completion-tracking-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import HypermediaHelper from '../helpers/hypermedia-helper.js';

export class D2LSequencesContentVideo extends D2L.Polymer.Mixins.Sequences.AutomaticCompletionTrackingMixin() {
	static get template() {
		return html`
		<style>
			d2l-labs-media-player {
				width: 100%;
				max-height: calc(100% - 12px);
				overflow: hidden;
			}
		</style>
		<d2l-labs-media-player src="[[_fileLocation]]" auto-load=""></d2l-labs-media-player>
`;
	}

	static get is() {
		return 'd2l-sequences-content-video';
	}
	static get properties() {
		return {
			href: {
				type: String,
				reflectToAttribute: true,
				notify: true,
				observer: '_scrollToTop'
			},
			_fileLocation: {
				type: String,
				computed: '_getFileLocation(entity)'
			},
			title: {
				type: String,
				computed: '_getTitle(entity)'
			}
		};
	}

	_scrollToTop() {
		window.top.scrollTo(0, 0);
	}

	_getFileLocation(entity) {
		return HypermediaHelper.getFileLocation(entity);
	}
	_getTitle(entity) {
		return entity && entity.properties && entity.properties.title || '';
	}

}
customElements.define(D2LSequencesContentVideo.is, D2LSequencesContentVideo);
