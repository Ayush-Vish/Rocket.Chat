FileUpload.S3 = class FileUploadS3 extends FileUploadBase {
	constructor(meta, file, data) {
		super(meta, file, data);
		this.uploader = new Slingshot.Upload('rocketchat-uploads', { roomId: meta.roomId });
	}
	start() {
		this.uploader.send(this.file, (error, downloadUrl) => {
			var file, item, uploading;

			if (error) {
				console.log('error ->', error);
				uploading = Session.get('uploading');
				if (uploading != null) {
					item = _.findWhere(uploading, {
						id: this.id
					});
					if (item != null) {
						item.error = error.error;
						item.percentage = 0;
					}
					Session.set('uploading', uploading);
				}
			} else {
				file = _.pick(this.meta, 'type', 'size', 'name');
				file.url = downloadUrl;

				Meteor.call('sendFileMessage', this.meta.roomId, file, () => {
					Meteor.setTimeout(() => {
						uploading = Session.get('uploading');
						if (uploading != null) {
							item = _.findWhere(uploading, {
								id: this.id
							});
							return Session.set('uploading', _.without(uploading, item));
						}
					}, 2000);
				});
			}
		});
	}

	getProgress() {
		return this.uploader.progress();
	}

	stop() {
		if (this.uploader && this.uploader.xhr) {
			this.uploader.xhr.abort();
		}
	}
}
