CREATE TYPE "ActivityStatus" AS ENUM ('published');
CREATE TYPE "SubmissionStatus" AS ENUM ('submitted', 'graded');

CREATE TABLE "Activity" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "classroomId" UUID NOT NULL,
  "creatorUserId" UUID NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "status" "ActivityStatus" NOT NULL DEFAULT 'published',
  "publishedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "Activity_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE,
  CONSTRAINT "Activity_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE CASCADE,
  CONSTRAINT "Activity_creatorUserId_fkey" FOREIGN KEY ("creatorUserId") REFERENCES "User"("id") ON DELETE RESTRICT
);

CREATE INDEX "Activity_tenantId_idx" ON "Activity"("tenantId");
CREATE INDEX "Activity_classroomId_idx" ON "Activity"("classroomId");
CREATE INDEX "Activity_creatorUserId_idx" ON "Activity"("creatorUserId");
CREATE INDEX "Activity_status_idx" ON "Activity"("status");

CREATE TABLE "Submission" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "tenantId" UUID NOT NULL,
  "activityId" UUID NOT NULL,
  "studentId" UUID NOT NULL,
  "content" TEXT NOT NULL,
  "status" "SubmissionStatus" NOT NULL DEFAULT 'submitted',
  "score" INTEGER,
  "feedback" TEXT,
  "gradedAt" TIMESTAMPTZ,
  "gradedByUserId" UUID,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT "Submission_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE,
  CONSTRAINT "Submission_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE CASCADE,
  CONSTRAINT "Submission_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE,
  CONSTRAINT "Submission_gradedByUserId_fkey" FOREIGN KEY ("gradedByUserId") REFERENCES "User"("id") ON DELETE SET NULL
);

CREATE UNIQUE INDEX "Submission_activityId_studentId_key" ON "Submission"("activityId", "studentId");
CREATE INDEX "Submission_tenantId_idx" ON "Submission"("tenantId");
CREATE INDEX "Submission_activityId_idx" ON "Submission"("activityId");
CREATE INDEX "Submission_studentId_idx" ON "Submission"("studentId");
CREATE INDEX "Submission_gradedByUserId_idx" ON "Submission"("gradedByUserId");
CREATE INDEX "Submission_status_idx" ON "Submission"("status");
