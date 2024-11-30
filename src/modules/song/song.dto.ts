import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsUrl,
  Length,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export class SongRequest {
  @IsNotEmpty({ message: 'Title is required' })
  @IsString({ message: 'Title must be a string' })
  @Length(3, 100, { message: 'Title must be between 3 and 100 characters' })
  title: string;

  @IsNotEmpty({ message: 'Artist is required' })
  @IsString({ message: 'Artist must be a string' })
  @Length(3, 100, { message: 'Artist must be between 3 and 100 characters' })
  artist: string;

  @IsOptional()
  @IsString({ message: 'Album must be a string' })
  @Length(3, 100, { message: 'Album must be between 3 and 100 characters' })
  album?: string;

  @IsNotEmpty({ message: 'File path is required' })
  @IsString({ message: 'File path must be a string' })
  @IsUrl({}, { message: 'File path must be a valid URL' })
  filePath: string;
}

export class RatingRequest {
  @IsNotEmpty({ message: 'Rating is required' })
  @IsNumber({}, { message: 'Rating must be a number' })
  @Min(1, { message: 'Rating must be at least 1' })
  @Max(5, { message: 'Rating must be at most 5' })
  rating: number;
}

export class SongResponse {
  id: number;
  title: string;
  artist: string;
  album?: string;
  filePath: string;
}
