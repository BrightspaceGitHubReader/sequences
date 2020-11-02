import '../mixins/d2l-sequences-automatic-completion-tracking-mixin.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import '@brightspace-ui-labs/media-player/media-player.js';
import '@d2l/audio/d2l-audio.js';
import HypermediaHelper from '../helpers/hypermedia-helper.js';

export class D2LSequencesContentAudio extends D2L.Polymer.Mixins.Sequences.AutomaticCompletionTrackingMixin() {
	static get template() {
		return html`
		<style>
			d2l-audio, d2l-labs-media-player {
				width: 100%;
				height: calc(100% - 12px);
				overflow: hidden;
			}
		</style>
		<template is="dom-if" if="[[useMediaPlayer]]">
			<d2l-labs-media-player src="[[_fileLocation]]" allow-download="[[allowMediaDownloads]]"></d2l-labs-media-player>
		</template>
		<template is="dom-if" if="[[!useMediaPlayer]]">
			<d2l-audio src="[[_fileLocation]]" auto-load=""></d2l-audio>
		</template>
`;
	}

	static get is() {
		return 'd2l-sequences-content-audio';
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
			},
			useMediaPlayer: {
				type: Boolean,
				reflectToAttribute: true,
				value: false
			},
			allowMediaDownloads: {
				type: Boolean,
				reflectToAttribute: true,
				value: false
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
customElements.define(D2LSequencesContentAudio.is, D2LSequencesContentAudio);
