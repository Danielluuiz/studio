"use client";

import React from "react";
import { PremiumLock } from "@/components/premium-lock";
import type { UserProfile } from "@/types";

interface ProgressTabProps {
  userProfile: UserProfile | null;
}

export default function ProgressTab({ userProfile }: ProgressTabProps) {
  return <PremiumLock featureName="Análise de Progresso" />;
}
