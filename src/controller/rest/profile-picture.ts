import {
  HasMimeType,
  IsFile,
  MaxFileSize,
  MemoryStoredFile,
} from "nestjs-form-data";

export class ProfilePicture {
  @IsFile()
  @MaxFileSize(1e6)
  @HasMimeType(["image/jpeg", "image/png"])
  file: MemoryStoredFile;
}
