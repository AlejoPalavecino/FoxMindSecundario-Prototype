ALTER TABLE "Enrollment"
ADD CONSTRAINT "Enrollment_tenantId_fkey"
FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE;
