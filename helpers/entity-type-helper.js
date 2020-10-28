import { D2LSequencesContentEoLMain } from '../components/d2l-sequences-content-eol-main.js';
import { D2LSequencesContentFileHtml } from '../components/d2l-sequences-content-file-html.js';
import { D2LSequencesContentFilePdf } from '../components/d2l-sequences-content-file-pdf.js';
import { D2LSequencesContentVideo } from '../components/d2l-sequences-content-video';
import { D2LSequencesContentAudio } from '../components/d2l-sequences-content-audio';
import { D2LSequencesContentImage } from '../components/d2l-sequences-content-image';
import { D2LSequencesContentLinkMixed } from '../components/d2l-sequences-content-link-mixed.js';
import { D2LSequencesContentLinkNewTab } from '../components/d2l-sequences-content-link-new-tab';
import { D2LSequencesContentLinkScorm } from '../components/d2l-sequences-content-link-scorm.js';
import { D2LSequencesContentLinkOnedrive } from '../components/d2l-sequences-content-link-onedrive.js';
import { D2LSequencesContentLinkGoogledrive } from '../components/d2l-sequences-content-link-googledrive.js';
import { D2LSequencesContentLink } from '../components/d2l-sequences-content-link.js';
import { D2LSequencesContentUnknown } from '../components/d2l-sequences-content-unknown.js';
import { D2LSequencesContentFileProcessing } from '../components/d2l-sequences-content-file-processing';
import { D2LSequencesContentModule } from '../components/d2l-sequences-content-module.js';
import { D2LSequencesContentContentServiceLink } from '../components/d2l-sequences-content-content-service-link.js';
import { D2LSequencesContentFileDownload } from '../components/d2l-sequences-content-file-download';

class EntityTypeHelper {
	static get fileActivity() {
		return 'file-activity';
	}
	static get fileUnknown() {
		return D2LSequencesContentFileDownload.is;
	}
	static get fileProcessing() {
		return D2LSequencesContentFileProcessing.is;
	}
	static get linkActivity() {
		return 'link-activity';
	}
	static get extMimeType() {
		return new Map([
			['aac', D2LSequencesContentAudio.is],
			['flac', D2LSequencesContentAudio.is],
			['m4a', D2LSequencesContentAudio.is],
			['mp3', D2LSequencesContentAudio.is],
			['wav', D2LSequencesContentAudio.is],
			['mp4', D2LSequencesContentVideo.is],
			['webm', D2LSequencesContentVideo.is],
		]);
	}
	static get mimeType() {
		return new Map([
			['application/pdf', D2LSequencesContentFilePdf.is],
			['video/mp4', D2LSequencesContentVideo.is],
			['video/ogg', D2LSequencesContentVideo.is],
			['video/webm', D2LSequencesContentVideo.is],
			['audio/webm', D2LSequencesContentVideo.is],
			['audio/flac', D2LSequencesContentAudio.is],
			['audio/mp3', D2LSequencesContentAudio.is],
			['audio/ogg', D2LSequencesContentAudio.is],
			['audio/aac', D2LSequencesContentAudio.is],
			['audio/wave', D2LSequencesContentAudio.is],
			['image/bmp', D2LSequencesContentImage.is],
			['image/gif', D2LSequencesContentImage.is],
			['image/jpeg', D2LSequencesContentImage.is],
			['image/png', D2LSequencesContentImage.is],
			['image/svg+xml', D2LSequencesContentImage.is],
			['text/html', D2LSequencesContentFileHtml.is]
		]);
	}

	static getEntityTypeByFilename(filename) {
		const [ext] = (filename || '').split('.').reverse();
		return EntityTypeHelper.extMimeType.get(ext);
	}

	static getEntityType(entity) {
		if (!entity || !entity.entities) {
			return D2LSequencesContentUnknown.is;
		}

		if (entity.class.includes(D2LSequencesContentEoLMain.eolClass)) {
			return D2LSequencesContentEoLMain.is;
		}

		if (entity.class.includes(D2LSequencesContentModule.contentModuleClass)) {
			return D2LSequencesContentModule.is;
		}

		for (let i = 0; i < entity.entities.length; i++) {
			const subEntity = entity.entities[i];
			// hypermedia classes tend to be more specific at the end of the array
			for (let j = subEntity.class.length - 1; j >= 0; --j) {
				switch (subEntity.class[j]) {
					case D2LSequencesContentLinkOnedrive.contentClass:
						return D2LSequencesContentLinkOnedrive.is;
					case D2LSequencesContentLinkGoogledrive.contentClass:
						return D2LSequencesContentLinkGoogledrive.is;
					case EntityTypeHelper.fileActivity:
						return EntityTypeHelper.getFileEntityType(subEntity);
					case EntityTypeHelper.linkActivity:
						return EntityTypeHelper.getLinkEntityType(subEntity);
					case D2LSequencesContentLinkScorm.contentClass:
						return subEntity.hasClass('open-in-new-tab') ? D2LSequencesContentLinkScorm.is : D2LSequencesContentContentServiceLink.is;
					case 'link-scorm-2004':
						return D2LSequencesContentLinkScorm.is;
					case 'link-scorm-1-2':
						return D2LSequencesContentLinkScorm.is;
				}
			}
		}
		return D2LSequencesContentUnknown.is;
	}

	static  getFileEntityType(fileActivity) {
		const file = fileActivity.getSubEntityByClass('file');
		let mimeType = file && file.properties && file.properties.type;

		// A converted doc will either be processing,
		// or present with the d2l-converted-doc class
		if (file && file.getLinkByClass('d2l-converted-doc')) {
			mimeType = file.getLinkByClass('d2l-converted-doc').type;
		} else if (fileActivity.getSubEntityByClass('processing')) {
			return EntityTypeHelper.fileProcessing;
		}

		return EntityTypeHelper.mimeType.get(mimeType) || EntityTypeHelper.fileUnknown;
	}

	static getLinkEntityType(linkActivity) {
		const link = linkActivity.getLinkByRel('about');
		const embedLink = linkActivity.getLinkByClass('embed');
		const openInNewTab = linkActivity.hasClass('open-in-new-tab');
		const isLorPdf = link.hasClass('adapted-lor-pdf');
		const href = (link && link.href) || (embedLink && embedLink.href);
		if (link && isLorPdf) {
			return D2LSequencesContentFilePdf.is;
		} else if (href && href.startsWith(window.location.protocol)) {
			return EntityTypeHelper.getEntityTypeByFilename(href) || (openInNewTab
				? D2LSequencesContentLinkNewTab.is
				: D2LSequencesContentLink.is
			);
		} else {
			return D2LSequencesContentLinkMixed.is;
		}
	}
}

export default EntityTypeHelper;
