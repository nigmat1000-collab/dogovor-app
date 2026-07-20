export interface ContractDraft {
  id: string;
  contractId: string;
  contractTitle: string;
  fields: Record<string, string>;
  status: "draft" | "signed";
  createdAt: string;
  signedAt?: string;
  signatureDataUrl?: string;
  party1Signature?: string;
  party2Signature?: string;
  signingPhotoUrl?: string;
  biometricVerified?: boolean;
}

export function getDrafts(): ContractDraft[] {
  const stored = localStorage.getItem("contract_drafts");
  return stored ? JSON.parse(stored) : [];
}

export function getDraft(id: string): ContractDraft | undefined {
  return getDrafts().find((d) => d.id === id);
}

export function saveDraft(draft: ContractDraft): void {
  const drafts = getDrafts();
  const idx = drafts.findIndex((d) => d.id === draft.id);
  if (idx >= 0) drafts[idx] = draft;
  else drafts.push(draft);
  localStorage.setItem("contract_drafts", JSON.stringify(drafts));
}

export function deleteDraft(id: string): void {
  const drafts = getDrafts().filter((d) => d.id !== id);
  localStorage.setItem("contract_drafts", JSON.stringify(drafts));
}

export function signDraft(id: string, signatureDataUrl?: string): void {
  const draft = getDraft(id);
  if (draft) {
    draft.status = "signed";
    draft.signedAt = new Date().toISOString();
    if (signatureDataUrl) draft.signatureDataUrl = signatureDataUrl;
    saveDraft(draft);
  }
}
