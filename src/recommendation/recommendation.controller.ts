import { Controller, Get, Query, HttpException, HttpStatus } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import { Recommendation } from './schemas/recommendation.schema';

@Controller('recommendations')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Get('generate')
  async generateRecommendation(
    @Query('userToken') userToken: string,
  ): Promise<Recommendation> {
    try {
      if (!userToken) {
        throw new HttpException('Missing userToken', HttpStatus.BAD_REQUEST);
      }

      return await this.recommendationService.generateRecommendation(userToken);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to generate recommendations',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
