import { Controller, Get, Query, HttpException, HttpStatus } from '@nestjs/common';
import { RecommendationService } from './recommendation.service';
import { Recommendation } from './schemas/recommendation.schema';

@Controller('recommendations')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Get('generate')
  async generateRecommendation(
    @Query('userToken') userToken: string,
    @Query('period') period: string,
  ): Promise<Recommendation> {
    try {
      if (!userToken || !period) {
        throw new HttpException('Missing userToken or period', HttpStatus.BAD_REQUEST);
      }

      const recommendation = await this.recommendationService.generateRecommendation(userToken, period);
      return recommendation;
    } catch (error) {
      console.error('Error generating recommendation:', error.message);
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
