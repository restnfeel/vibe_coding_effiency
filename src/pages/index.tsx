import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';

const stats = [
  { number: '7개', label: '챕터 구성' },
  { number: '80%+', label: '비용 절감 가능' },
  { number: '3가지', label: '핵심 도구 조합' },
  { number: '5x', label: '빠른 개발 사이클' },
];

const features = [
  {
    icon: '🏗️',
    title: '도메인 → Task → Skills 구조',
    desc: '프로젝트를 도메인 단위로 분리하고, 각 Task에 맞는 모델을 배분하는 RAP 아키텍처를 설명합니다.',
  },
  {
    icon: '💡',
    title: '모델 선정 & 비용 전략',
    desc: 'Opus, Gemini Flash, Kimi k2.5, 로컬 vLLM을 조합해 Quality·Speed·Cost를 균형 있게 최적화합니다.',
  },
  {
    icon: '⚙️',
    title: 'Cursor + Opencode + vLLM 설정',
    desc: 'OpenRouter 연결부터 .cursorrules Skills 등록, 로컬 vLLM 서버 구성까지 단계별 설정 가이드를 제공합니다.',
  },
  {
    icon: '📝',
    title: '실전 프롬프트 예시',
    desc: '도메인 설계, CRUD 생성, 테스트 자동화, 코드 리뷰까지 복사해서 바로 쓸 수 있는 프롬프트 템플릿 모음입니다.',
  },
  {
    icon: '🔄',
    title: '실전 워크플로우 A to Z',
    desc: '신규 기능 개발의 전 과정을 비용 시뮬레이션과 함께 제공합니다. 같은 작업을 Opus만 쓰면 10배 비쌉니다.',
  },
  {
    icon: '✅',
    title: '비용 절감 체크리스트',
    desc: '프로젝트 시작 전, 개발 중, 세션 전환 시마다 점검할 체크리스트로 비용 누수를 사전에 차단합니다.',
  },
];

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={siteConfig.title}
      description="Quality · Speed · Cost 균형 잡는 바이브 코딩 전략 — 디지로그랩스">

      {/* Hero */}
      <header className={styles.heroBanner}>
        <div className="container">
          <div className={styles.badge}>DIGILOG LABS × Vibe Coding</div>
          <h1 className={styles.heroTitle}>
            AI 개발 생산성을 극대화하는<br />바이브 코딩 가이드
          </h1>
          <p className={styles.heroSubtitle}>
            <span className={styles.heroSubtitleStrong}>Quality · Speed · Cost</span>, 세 가지를 동시에 잡는 전략
          </p>
          <p className={styles.heroSubtitle}>
            비싼 모델을 무분별하게 쓰는 건 낭비입니다.<br />
            올바른 도구 조합으로 최소 비용에 최대 퀄리티를 달성하세요.
          </p>
          <div className={styles.buttons}>
            <Link className={styles.btnPrimary} to="/intro">
              가이드 시작하기 →
            </Link>
            <Link className={styles.btnSecondary} to="/workflow">
              실전 워크플로우 보기
            </Link>
          </div>
        </div>
      </header>

      {/* Stats */}
      <section className={styles.statsSection}>
        <div className="container">
          <div className={styles.statsGrid}>
            {stats.map((s, i) => (
              <div key={i} className={styles.statItem}>
                <div className={styles.statNumber}>{s.number}</div>
                <div className={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className={styles.featuresSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>가이드 구성</h2>
          <p className={styles.sectionSubtitle}>
            입문부터 실전 자동화까지, 중급 개발자를 위한 7챕터
          </p>
          <div className={styles.featureGrid}>
            {features.map((f, i) => (
              <div key={i} className={styles.featureCard}>
                <div className={styles.featureIcon}>{f.icon}</div>
                <div className={styles.featureTitle}>{f.title}</div>
                <p className={styles.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <div className="container">
          <h2 className={styles.ctaTitle}>지금 바로 시작하세요</h2>
          <p className={styles.ctaDesc}>
            Cursor, Opencode, vLLM을 전략적으로 조합하면<br />
            AI 코딩 비용을 80% 줄이면서 퀄리티는 유지할 수 있습니다.
          </p>
          <div className={styles.buttons}>
            <Link className={styles.btnPrimary} to="/intro">
              가이드 시작하기 →
            </Link>
          </div>
          <p className={styles.ctaFrom}>
            by{' '}
            <a
              className={styles.ctaFromLink}
              href="https://digiloglabs.com"
              target="_blank"
              rel="noopener noreferrer">
              디지로그랩스 주식회사
            </a>
            {' '}— 디지털과 아날로그가 만나는 곳
          </p>
        </div>
      </section>

    </Layout>
  );
}
