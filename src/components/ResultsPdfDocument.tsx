import type { ElementType } from 'react';
import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';
import { Image } from '@react-pdf/renderer';
import { CATEGORY_LABELS, CATEGORY_MAX_SCORES, QUESTIONS, getScorePercentage, getTopCategories } from '@/data/questions';
import { RESULT_DESCRIPTIONS } from '@/data/results';
import type { RegistrationDetail } from '@/api/educine';
import type { RiasecCategory, RiasecScores } from '@/data/questions';
import { pdf } from '@react-pdf/renderer';

type ResultsPdfDocumentProps = {
  registration: RegistrationDetail;
  scores: RiasecScores;
  topCategories: RiasecCategory[];
  language?: 'english' | 'malayalam';
};

type ProfileLanguage = 'english' | 'malayalam';

export async function generateResultsPdfBlob({
  registration,
  scores,
  topCategories,
  language = 'english',
}: ResultsPdfDocumentProps): Promise<Blob> {
  const instance = pdf(
    <ResultsPdfDocument
      registration={registration}
      scores={scores}
      topCategories={topCategories}
      language={language}
    />,
  );

  return instance.toBlob();
}

type PageRenderProps = {
  pageNumber: number;
  totalPages: number;
};

const PdfDocument = Document as unknown as ElementType;
const PdfImage = Image as unknown as ElementType;
const PdfPage = Page as unknown as ElementType;
const PdfText = Text as unknown as ElementType;
const PdfView = View as unknown as ElementType;
const WEFI_LOGO_SRC = '/wefi.png';

Font.register({
  family: 'NotoSansMalayalam',
  src: 'https://raw.githubusercontent.com/googlefonts/noto-fonts/master/hinted/ttf/NotoSansMalayalam/NotoSansMalayalam-Regular.ttf',
});

const CATEGORY_QUESTION_COUNT = QUESTIONS.reduce<Record<RiasecCategory, number>>(
  (acc, question) => {
    acc[question.category] += 1;
    return acc;
  },
  { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 },
);

const rankedScores = (scores: RiasecScores) =>
  getTopCategories(scores).map((category) => [category, scores[category]] as [RiasecCategory, number]);

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    color: '#16324f',
    fontFamily: 'Helvetica',
    fontSize: 10,
    paddingTop: 104,
    paddingBottom: 54,
    paddingHorizontal: 34,
  },
  header: {
    position: 'absolute',
    top: 20,
    left: 34,
    right: 34,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#1158a8',
  },
  brandBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandLogo: {
    width: 78,
    height: 58,
    objectFit: 'contain',
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: '#0f2f57',
  },
  brandSubtitle: {
    marginTop: 2,
    fontSize: 8.5,
    color: '#4b6480',
  },
  headerMeta: {
    alignItems: 'flex-end',
  },
  headerMetaLabel: {
    fontSize: 7.5,
    color: '#5d7692',
    textTransform: 'uppercase',
  },
  headerMetaValue: {
    marginTop: 3,
    fontSize: 10,
    fontWeight: 700,
    color: '#16324f',
  },
  footer: {
    position: 'absolute',
    left: 34,
    right: 34,
    bottom: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#d7e3f1',
    paddingTop: 8,
  },
  footerText: {
    fontSize: 8,
    color: '#6e8297',
  },
  pageNumber: {
    fontSize: 8,
    color: '#6e8297',
  },
  reportTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: '#0f2f57',
  },
  reportLead: {
    marginTop: 6,
    fontSize: 10,
    lineHeight: 1.45,
    color: '#4d637d',
  },
  advisoryBox: {
    marginTop: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d5e3f4',
    backgroundColor: '#f7fafc',
    padding: 12,
  },
  advisoryTitle: {
    fontSize: 9.5,
    fontWeight: 700,
    color: '#12385f',
  },
  advisoryText: {
    marginTop: 5,
    fontSize: 8.8,
    lineHeight: 1.5,
    color: '#4b6480',
  },
  heroCard: {
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d5e3f4',
    backgroundColor: '#ffffff',
    padding: 12,
  },
  twoColumnRow: {
    flexDirection: 'row',
    gap: 8,
  },
  flexOne: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 7.5,
    color: '#6f8198',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  infoValue: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: 700,
    color: '#16324f',
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: '#0f2f57',
  },
  sectionHint: {
    marginTop: 4,
    fontSize: 9,
    color: '#61758d',
    lineHeight: 1.4,
  },
  profileCard: {
    marginTop: 10,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    backgroundColor: '#ffffff',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rankBadge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  rankBadgeText: {
    fontSize: 10,
    fontWeight: 700,
    color: '#ffffff',
  },
  profileTitle: {
    flex: 1,
    fontSize: 11,
    fontWeight: 700,
    color: '#16324f',
  },
  profileScore: {
    fontSize: 9,
    color: '#58718c',
  },
  profileDescription: {
    marginTop: 8,
    fontSize: 9.5,
    lineHeight: 1.5,
    color: '#445d79',
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  tag: {
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 8,
    fontSize: 8,
  },
  scoreTable: {
    marginTop: 12,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#d5e3f4',
    backgroundColor: '#ffffff',
  },
  scoreRow: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ebf0f6',
  },
  scoreRowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: '#16324f',
  },
  scoreMeta: {
    fontSize: 8.5,
    color: '#657b93',
  },
  scoreBarTrack: {
    marginTop: 7,
    height: 7,
    borderRadius: 999,
    backgroundColor: '#e8eef5',
  },
  scoreBarFill: {
    height: 7,
    borderRadius: 999,
  },
  insightCard: {
    marginTop: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d5e3f4',
    backgroundColor: '#ffffff',
    padding: 14,
  },
  insightHeading: {
    fontSize: 10,
    fontWeight: 700,
    color: '#16324f',
  },
  bulletList: {
    marginTop: 8,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 5,
  },
  bulletDot: {
    width: 5,
    height: 5,
    marginTop: 4,
    borderRadius: 2.5,
    backgroundColor: '#1158a8',
  },
  bulletText: {
    flex: 1,
    fontSize: 9.2,
    lineHeight: 1.45,
    color: '#445d79',
  },
  footnoteBox: {
    marginTop: 14,
    borderRadius: 10,
    backgroundColor: '#eff5fb',
    padding: 12,
  },
  footnoteTitle: {
    fontSize: 9.5,
    fontWeight: 700,
    color: '#12385f',
  },
  footnoteText: {
    marginTop: 6,
    fontSize: 8.5,
    lineHeight: 1.55,
    color: '#4b6480',
  },
});

const getContentTextStyle = (language: ProfileLanguage) =>
  language === 'malayalam' ? { fontFamily: 'NotoSansMalayalam' } : null;

const sanitizePdfText = (value: string, language: ProfileLanguage) => {
  if (!value) return '';
  if (language === 'malayalam') {
    // Removes ZWJ and ZWNJ which often cause the 'anchor is null' error
    return value.replace(/[\u200B-\u200D\uFEFF]/g, '');
  }
  return value;
};
function ReportHeader() {
  return (
    <PdfView fixed style={styles.header}>
      <PdfView style={styles.brandBlock}>
        <PdfImage src={WEFI_LOGO_SRC} style={styles.brandLogo} />
        <PdfView>
          <PdfText style={styles.brandTitle}>WEFI Career Aptitude Report</PdfText>
          <PdfText style={styles.brandSubtitle}>Career guidance assessment summary</PdfText>
        </PdfView>
      </PdfView>
      <PdfView style={styles.headerMeta}>
        <PdfText style={styles.headerMetaLabel}>Document Type</PdfText>
        <PdfText style={styles.headerMetaValue}>RIASEC Assessment</PdfText>
      </PdfView>
    </PdfView>
  );
}

function ReportFooter() {
  return (
    <PdfView fixed style={styles.footer}>
      <PdfText
        style={styles.pageNumber}
        render={({ pageNumber, totalPages }: PageRenderProps) => `Page ${pageNumber} of ${totalPages}`}
      />
    </PdfView>
  );
}

function ScoreTable({ scores }: { scores: RiasecScores }) {
  return (
    <PdfView style={styles.scoreTable}>
      {rankedScores(scores).map(([category, score], index, items) => {
        const info = CATEGORY_LABELS[category];
        const percentage = getScorePercentage(category, score);

        return (
          <PdfView
            key={category}
            style={[
              styles.scoreRow,
              index === items.length - 1 ? { borderBottomWidth: 0 } : null,
            ]}
          >
            <PdfView style={styles.scoreRowTop}>
              <PdfText style={styles.scoreLabel}>{info.english}</PdfText>
              <PdfText style={styles.scoreMeta}>
                {score}/{CATEGORY_MAX_SCORES[category]} ({percentage}%)
              </PdfText>
            </PdfView>
            <PdfView style={styles.scoreBarTrack}>
              <PdfView
                style={[
                  styles.scoreBarFill,
                  { width: `${percentage}%`, backgroundColor: info.color },
                ]}
              />
            </PdfView>
          </PdfView>
        );
      })}
    </PdfView>
  );
}

function TopProfileCards({
  scores,
  topCategories,
  language,
}: {
  scores: RiasecScores;
  topCategories: RiasecCategory[];
  language: ProfileLanguage;
}) {
  const contentTextStyle = getContentTextStyle(language);

  return (
    <PdfView>
      {topCategories.slice(0, 3).map((category, index) => {
        const info = CATEGORY_LABELS[category];
        const description = RESULT_DESCRIPTIONS[category];

        return (
          <PdfView
            key={category}
            style={[
              styles.profileCard,
              { borderColor: `${info.color}66` },
            ]}
          >
            <PdfView style={styles.profileHeader}>
              <PdfView style={[styles.rankBadge, { backgroundColor: info.color }]}>
                <PdfText style={styles.rankBadgeText}>#{index + 1}</PdfText>
              </PdfView>
              <PdfText style={[styles.profileTitle, contentTextStyle]}>{sanitizePdfText(description.title[language], language)}</PdfText>
              <PdfText style={styles.profileScore}>
                {scores[category]}/{CATEGORY_MAX_SCORES[category]} ({getScorePercentage(category, scores[category])}%)
              </PdfText>
            </PdfView>
            <PdfText style={[styles.profileDescription, contentTextStyle]}>{sanitizePdfText(description.description[language], language)}</PdfText>
            <PdfView style={styles.tagRow}>
              {description.careers[language].slice(0, 6).map((career) => (
                <PdfText
                  key={career}
                  style={{
                    ...styles.tag,
                    backgroundColor: `${info.color}18`,
                    color: info.color,
                    ...(contentTextStyle ?? {}),
                  }}
                >
                  {sanitizePdfText(career, language)}
                </PdfText>
              ))}
            </PdfView>
          </PdfView>
        );
      })}
    </PdfView>
  );
}

export function ResultsPdfDocument({
  registration,
  scores,
  topCategories,
  language = 'english',
}: ResultsPdfDocumentProps) {
  const dominantCode = topCategories.slice(0, 3).join('');
  const strongestCategory = topCategories[0];
  const strongestLabel = CATEGORY_LABELS[strongestCategory].english;
  const participantName = registration.name;
  const participantDistrict = registration.place || '—';

  return (
    <PdfDocument title={`RIASEC Result - ${registration.name}`}>
      <PdfPage size="A4" style={styles.page}>
        <ReportHeader />
        <ReportFooter />

        <PdfText style={styles.reportTitle}>Career Aptitude Assessment Report</PdfText>
        <PdfText style={styles.reportLead}>
          This document summarizes the participant&apos;s RIASEC interest pattern, highlights the top-matching domains, and presents a structured score interpretation for counselling and follow-up discussion.
        </PdfText>

        <PdfView style={styles.advisoryBox}>
          <PdfText style={styles.advisoryTitle}>Advisory Note</PdfText>
          <PdfText style={styles.advisoryText}>
            The results of this assessment are indicative and should not be considered conclusive. Professional guidance from a career counsellor is advised for comprehensive interpretation and decision-making.
          </PdfText>
        </PdfView>

        <PdfView style={styles.heroCard}>
          <PdfView style={styles.twoColumnRow}>
            <PdfView style={styles.flexOne}>
              <PdfText style={styles.infoLabel}>Participant</PdfText>
              <PdfText style={styles.infoValue}>{participantName}</PdfText>
            </PdfView>
            <PdfView style={styles.flexOne}>
              <PdfText style={styles.infoLabel}>Phone</PdfText>
              <PdfText style={styles.infoValue}>{registration.mobile}</PdfText>
            </PdfView>
          </PdfView>
          <PdfView style={[styles.twoColumnRow, { marginTop: 8 }]}>
            <PdfView style={styles.flexOne}>
              <PdfText style={styles.infoLabel}>District</PdfText>
              <PdfText style={styles.infoValue}>{participantDistrict}</PdfText>
            </PdfView>
            <PdfView style={styles.flexOne}>
              <PdfText style={styles.infoLabel}>Dominant Code</PdfText>
              <PdfText style={styles.infoValue}>{dominantCode}</PdfText>
            </PdfView>
          </PdfView>
        </PdfView>

        <PdfView style={styles.section}>
          <PdfText style={styles.sectionTitle}>Executive Summary</PdfText>
          <PdfText style={styles.sectionHint}>
            {`The highest-scoring domain is ${strongestLabel}. The detailed interpretation is shown in the top three profile cards below.`}
          </PdfText>
          <TopProfileCards scores={scores} topCategories={topCategories} language={language} />
        </PdfView>

        <PdfView style={styles.section}>
          <PdfText style={styles.sectionTitle}>Score Breakdown</PdfText>
          <PdfText style={styles.sectionHint}>
            Each category score is shown against its maximum possible value and a normalized percentage for easier comparison across the six RIASEC dimensions.
          </PdfText>
          <ScoreTable scores={scores} />
        </PdfView>

        <PdfView style={styles.section}>
          <PdfText style={styles.sectionTitle}>Interpretation Notes</PdfText>
          <PdfView style={styles.insightCard}>
            <PdfText style={styles.insightHeading}>How to read this report</PdfText>
            <PdfView style={styles.bulletList}>
              <PdfView style={styles.bulletRow}>
                <PdfView style={styles.bulletDot} />
                <PdfText style={styles.bulletText}>
                  The top three categories form the participant&apos;s current interest code and indicate the most prominent career-orientation pattern at the time of testing.
                </PdfText>
              </PdfView>
              <PdfView style={styles.bulletRow}>
                <PdfView style={styles.bulletDot} />
                <PdfText style={styles.bulletText}>
                  Higher scores suggest stronger preference or comfort with activities associated with that domain, not guaranteed competence or final career fit.
                </PdfText>
              </PdfView>
              <PdfView style={styles.bulletRow}>
                <PdfView style={styles.bulletDot} />
                <PdfText style={styles.bulletText}>
                  Use these results alongside academic performance, exposure, values, and counselling discussion before making pathway decisions.
                </PdfText>
              </PdfView>
            </PdfView>
          </PdfView>

          <PdfView style={styles.footnoteBox}>
            <PdfText style={styles.footnoteTitle}>Calculation Logic</PdfText>
            <PdfText style={styles.footnoteText}>
              {`The RIASEC questionnaire contains ${QUESTIONS.length} items distributed equally across six categories: Realistic, Investigative, Artistic, Social, Enterprising, and Conventional. Each response is scored on a 1 to 5 scale. For any category, the final score is calculated as the sum of all answers assigned to that category. In this assessment, each category contains ${CATEGORY_QUESTION_COUNT.R} questions, so the maximum possible score per category is ${CATEGORY_MAX_SCORES.R}. Categories are ranked from highest total to lowest total to identify the dominant interest pattern. The percentage shown in this report is computed as category score divided by category maximum score, multiplied by 100.`}
            </PdfText>
          </PdfView>
        </PdfView>
      </PdfPage>
    </PdfDocument>
  );
}