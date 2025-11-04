
export enum AppStage {
  Welcome,
  Screening,
  Intake,
  Generating,
  Results,
}

export interface ScreeningData {
  name: string;
  gender: string;
  partnerPreference: string;
  relationshipStatus: string;
}

export interface IntakeAnswer {
  question: string;
  answer: string;
}

export interface PartnerFitProfile {
  archetypes: string[];
  greenFlags: string[];
  frictionPoints: string[];
  communicationTips: string[];
}

export interface ActionKit {
  bioRewrite: string;
  conversationOpeners: string[];
  microHabits: string;
}

export interface FullBlueprint {
  emotionalBlueprint: string;
  partnerFitProfile: PartnerFitProfile;
  actionKit: ActionKit;
}

export interface VibeCheckQuestion {
    question: string;
    alignedAnswer: string;
    frictionSignal: string;
}
