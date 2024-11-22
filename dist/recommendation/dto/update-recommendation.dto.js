"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRecommendationDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_recommendation_dto_1 = require("./create-recommendation.dto");
class UpdateRecommendationDto extends (0, mapped_types_1.PartialType)(create_recommendation_dto_1.CreateRecommendationDto) {
}
exports.UpdateRecommendationDto = UpdateRecommendationDto;
//# sourceMappingURL=update-recommendation.dto.js.map