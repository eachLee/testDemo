jQuery(function () {
    var $ = jQuery,
        $list = $('#thelist'),
        $btn = $('#ctlBtn'),
        state = 'pending',
        // 优化retina, 在retina下这个值是2
        ratio = window.devicePixelRatio || 1,

        // 缩略图大小
        thumbnailWidth = 100 * ratio,
        thumbnailHeight = 100 * ratio,
        uploader;

    uploader = WebUploader.create({
        resize: false,

        swf: './css/Uploader.swf',

        server: 'http://10.1.30.115:31000/image/upload2',

        pick: '#picker',
        // 接受哪种类型的图片
        accept: {
            title: 'Images',
            extensions: 'gif,jpg,jpeg,bmp,png',
            mimeTypes: 'image/*'
        },
        //生成缩略图
        thumb: {
            width: thumbnailWidth,
            height: thumbnailHeight,

            // 图片质量，只有type为`image/jpeg`的时候才有效。
            quality: 70,

            // 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
            allowMagnify: true,

            // 是否允许裁剪。
            crop: true,

            // 为空的话则保留原有图片格式。
            // 否则强制转换成指定的类型。
            type: 'image/jpeg'
        },
        // 最大上传数量
        fileNumLimit: 30,
        // 总文件最大大小
        fileSizeLimit: 200 * 1024 * 1024,
        fileSingleSizeLimit: 20 * 1024 * 1024
    });

    // 当有文件添加进来的时候
    uploader.on('fileQueued', function (file) {
        var $li = $(
            '<li id="' + file.id + '" class="file-item thumbnail">' +
            '<img>' +
            '<div class="info" style=width:' + thumbnailWidth + 'px>' + file.name + '</div>' +
            '</li>'
        ),
            $img = $li.find('img');
        // $list为容器jQuery实例
        $list.append($li);

        // 创建缩略图
        // 如果为非图片文件，可以不用调用此方法。
        // thumbnailWidth x thumbnailHeight 为 100 x 100
        uploader.makeThumb(file, function (error, src) {
            if (error) {
                $img.replaceWith('<span>不能预览</span>');
                return;
            }
            $img.attr('src', src);
        }, thumbnailWidth, thumbnailHeight);
    });


    uploader.on('uploadProgress', function (file, percentage) {
        var $li = $('#' + file.id),
            $percent = $li.find('.progress .progress-bar');

        if (!$percent.length) {
            $percent = $('<div class="progress progress-striped active">' +
                '<div class="progress-bar" role="progressbar" style="width: 0%">' +
                '</div>' +
                '</div>').appendTo($li).find('.progress-bar');
        }

        $li.find('p.state').text('点击上传');

        $percent.css('width', percentage * 100 + '%');
    });
    // 文件上传过程中创建进度条实时显示。
    uploader.on('uploadProgress', function (file, percentage) {
        var $li = $('#' + file.id),
            $percent = $li.find('.progress span');

        // 避免重复创建
        if (!$percent.length) {
            $percent = $('<p class="progress"><span></span></p>')
                .appendTo($li)
                .find('span');
        }

        $percent.css('width', percentage * 100 + '%');
    });

    // 文件上传成功，给item添加成功class, 用样式标记上传成功。
    uploader.on('uploadSuccess', function (file) {
        $('#' + file.id).addClass('upload-state-done');
    });

    // 文件上传失败，显示上传出错。
    uploader.on('uploadError', function (file) {
        var $li = $('#' + file.id),
            $error = $li.find('div.error');

        // 避免重复创建
        if (!$error.length) {
            $error = $('<div class="error"></div>').appendTo($li);
        }

        $error.text('上传失败');
    });

    // 完成上传完了，成功或者失败，先删除进度条。
    uploader.on('uploadComplete', function (file) {
        // alert('上传成功')
        $('#' + file.id).find('.progress').remove();
    });


    uploader.on('all', function (type) {

        if (type === 'startUpload') {
            state = 'uploading';
        } else if (type === 'stopUpload') {
            state = 'paused';
        } else if (type === 'uploadFinished') {
            state = 'done';
        }

        if (state === 'uploading') {
            $btn.text('上传中.....');
        } else {
            $btn.text('开始上传');
        }
        if (state === 'done') {
            alert('上传成功');

        }
    });

    $btn.on('click', function () {
        if (state === 'uploading') {
            uploader.stop();
            $btn.text('已暂停')
        } else {
            uploader.upload();
        }
    });
});

