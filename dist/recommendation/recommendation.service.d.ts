import { CreateRecommendationDto } from './dto/create-recommendation.dto';
import { UpdateRecommendationDto } from './dto/update-recommendation.dto';
export declare class RecommendationService {
    create(createRecommendationDto: CreateRecommendationDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateRecommendationDto: UpdateRecommendationDto): string;
    remove(id: number): string;
}
