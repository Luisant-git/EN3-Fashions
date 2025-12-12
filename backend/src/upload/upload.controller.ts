import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('upload')
export class UploadController {
  @Post('image')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const originalName = file.originalname;
        if (originalName.startsWith('invoice-') || originalName.startsWith('packageslip-')) {
          cb(null, originalName);
        } else {
          const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        }
      },
    }),
  }))
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    const baseUrl = process.env.UPLOAD_URL || 'http://localhost:4062/uploads';
    return {
      filename: file.filename,
      url: `${baseUrl}/${file.filename}`,
    };
  }
}