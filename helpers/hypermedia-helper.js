class HypermediaHelper {
	static get linkContentClass() {
		return 'link-activity';
	}
	static get fileContentClass() {
		return 'file-activity';
	}

	static getLinkLocation(entity) {
		try {
			const linkActivity = entity.getSubEntityByClass(HypermediaHelper.linkContentClass);

			// if embed link exists, use that link
			const embedASVLink = linkActivity.getLinkByClass('embed-asv');
			if (embedASVLink !== undefined) {
				return embedASVLink.href;
			}

			const embedLink = linkActivity.getLinkByClass('embed');
			if (embedLink !== undefined) {
				return embedLink.href;
			}

			const link = linkActivity.getLinkByRel('about');
			return link.href;
		} catch (e) {
			return '';
		}
	}

	static getFileLocation(entity) {
		try {
			const fileActivity = entity.getSubEntityByClass(HypermediaHelper.fileContentClass);
			const file = fileActivity.getSubEntityByClass('file');
			const link = file.getLinkByClass('pdf') || file.getLinkByClass('embed') || file.getLinkByRel('alternate');
			return link.href;
		} catch (e) {
			return HypermediaHelper.getLinkLocation(entity);
		}
	}
}

export default HypermediaHelper;
