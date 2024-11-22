import { RecommendationService } from './recommendation.service';
import { CreateRecommendationDto } from './dto/create-recommendation.dto';
import { UpdateRecommendationDto } from './dto/update-recommendation.dto';
export declare class RecommendationController {
    private readonly recommendationService;
    constructor(recommendationService: RecommendationService);
    create(createRecommendationDto: CreateRecommendationDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateRecommendationDto: UpdateRecommendationDto): string;
    remove(id: string): string;
}
