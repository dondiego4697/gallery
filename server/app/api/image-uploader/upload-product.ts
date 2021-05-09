import Boom from '@hapi/boom';
import {wrap} from 'async-middleware';
import {Request, Response} from 'express';
import jimp from 'jimp';
import {v4 as uuidv4} from 'uuid';

import {config} from 'app/config';
import {writeToBucket} from 'service/s3';

async function processImage(buffer: Buffer): Promise<Buffer> {
    const jimpImage = await jimp.read(buffer);

    return jimpImage.normalize().getBufferAsync(jimp.MIME_JPEG);
}

export const uploadProduct = wrap<Request, Response>(async (req, res) => {
    const {files} = req.files || {};

    if (!files || Array.isArray(files)) {
        throw Boom.badRequest();
    }

    const {data: dataRaw, name} = files;
    const ext = name.split('.').pop();

    const data = await processImage(dataRaw);

    const objectName = `products/${uuidv4()}.${ext}`;
    const url = `https://${config['s3.host']}/${config['s3.bucketName']}/${objectName}`;

    const {statusCode, body} = await writeToBucket(data, {objectName});

    if (statusCode !== 200) {
        req.context.logger.error({
            group: 's3',
            statusCode,
            body,
            url
        });
        throw Boom.badRequest();
    }

    res.json({url});
});
