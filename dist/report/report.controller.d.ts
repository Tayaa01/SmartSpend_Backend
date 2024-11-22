import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
export declare class ReportController {
    private readonly reportService;
    constructor(reportService: ReportService);
    create(createReportDto: CreateReportDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateReportDto: UpdateReportDto): string;
    remove(id: string): string;
}
