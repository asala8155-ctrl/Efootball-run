export interface ServerNode {
  id: string;
  name: string;
  country: string;
  code: string;
  flag: string;
  basePing: number;
  jitterRange: number;
  matchmakingPool: string;
  konamiCluster: string;
  recommendedFor: string;
  score: number;
  measuredPing?: number;
  jitter?: number;
  packetLoss?: number;
  natType?: string;
  searchEstimatedSeconds?: number;
}

export interface DiagnosisResult {
  rootCauseAnalysis: string;
  whyDnsFails: string;
  winningStrategy: string;
  bestRegion: string;
  mtuRecommendation: number;
  apnSettings: string;
  recommendedActionSteps: string[];
  inGameSetting: string;
  confidenceScore: string;
}

export interface BoostMetrics {
  ping: number;
  jitter: number;
  packetLoss: number;
  natType: string;
  trafficUp: number;
  trafficDown: number;
  matchmakingTimeEstimate: string;
  activeMultipath: string[];
}
