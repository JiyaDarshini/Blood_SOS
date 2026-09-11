-- CreateEnum
CREATE TYPE "Role" AS ENUM ('DONOR', 'REQUESTER', 'BOTH', 'ADMIN');

-- CreateEnum
CREATE TYPE "BloodGroup" AS ENUM ('A_POS', 'A_NEG', 'B_POS', 'B_NEG', 'O_POS', 'O_NEG', 'AB_POS', 'AB_NEG');

-- CreateEnum
CREATE TYPE "Urgency" AS ENUM ('CRITICAL', 'URGENT', 'PLANNED');

-- CreateEnum
CREATE TYPE "SOSStatus" AS ENUM ('ACTIVE', 'FULFILLED', 'CLOSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ContactChannel" AS ENUM ('CALL', 'WHATSAPP');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'DISABLED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'REQUESTER',
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "donors" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "blood_group" "BloodGroup" NOT NULL,
    "locality" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "pincode" TEXT NOT NULL,
    "is_available" BOOLEAN NOT NULL DEFAULT true,
    "registered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "donors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sos_requests" (
    "id" TEXT NOT NULL,
    "requester_id" TEXT NOT NULL,
    "blood_group" "BloodGroup" NOT NULL,
    "units_required" INTEGER NOT NULL DEFAULT 1,
    "hospital_name" TEXT NOT NULL,
    "hospital_address" TEXT NOT NULL,
    "locality" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "urgency" "Urgency" NOT NULL DEFAULT 'URGENT',
    "contact_number" TEXT NOT NULL,
    "message" TEXT,
    "status" "SOSStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sos_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_logs" (
    "id" TEXT NOT NULL,
    "sos_id" TEXT NOT NULL,
    "donor_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "channel" "ContactChannel" NOT NULL,
    "contacted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "localities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "pincode" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "localities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_phone_idx" ON "users"("phone");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "users_status_idx" ON "users"("status");

-- CreateIndex
CREATE UNIQUE INDEX "donors_user_id_key" ON "donors"("user_id");

-- CreateIndex
CREATE INDEX "donors_blood_group_idx" ON "donors"("blood_group");

-- CreateIndex
CREATE INDEX "donors_locality_idx" ON "donors"("locality");

-- CreateIndex
CREATE INDEX "donors_city_idx" ON "donors"("city");

-- CreateIndex
CREATE INDEX "donors_pincode_idx" ON "donors"("pincode");

-- CreateIndex
CREATE INDEX "donors_is_available_idx" ON "donors"("is_available");

-- CreateIndex
CREATE INDEX "donors_blood_group_is_available_idx" ON "donors"("blood_group", "is_available");

-- CreateIndex
CREATE INDEX "donors_city_locality_idx" ON "donors"("city", "locality");

-- CreateIndex
CREATE INDEX "sos_requests_blood_group_idx" ON "sos_requests"("blood_group");

-- CreateIndex
CREATE INDEX "sos_requests_locality_idx" ON "sos_requests"("locality");

-- CreateIndex
CREATE INDEX "sos_requests_city_idx" ON "sos_requests"("city");

-- CreateIndex
CREATE INDEX "sos_requests_urgency_idx" ON "sos_requests"("urgency");

-- CreateIndex
CREATE INDEX "sos_requests_status_idx" ON "sos_requests"("status");

-- CreateIndex
CREATE INDEX "sos_requests_created_at_idx" ON "sos_requests"("created_at");

-- CreateIndex
CREATE INDEX "sos_requests_requester_id_idx" ON "sos_requests"("requester_id");

-- CreateIndex
CREATE INDEX "sos_requests_blood_group_status_idx" ON "sos_requests"("blood_group", "status");

-- CreateIndex
CREATE INDEX "contact_logs_sos_id_idx" ON "contact_logs"("sos_id");

-- CreateIndex
CREATE INDEX "contact_logs_donor_id_idx" ON "contact_logs"("donor_id");

-- CreateIndex
CREATE INDEX "contact_logs_user_id_idx" ON "contact_logs"("user_id");

-- CreateIndex
CREATE INDEX "contact_logs_contacted_at_idx" ON "contact_logs"("contacted_at");

-- CreateIndex
CREATE INDEX "contact_logs_channel_idx" ON "contact_logs"("channel");

-- CreateIndex
CREATE INDEX "localities_city_idx" ON "localities"("city");

-- CreateIndex
CREATE INDEX "localities_pincode_idx" ON "localities"("pincode");

-- CreateIndex
CREATE UNIQUE INDEX "localities_name_city_key" ON "localities"("name", "city");

-- AddForeignKey
ALTER TABLE "donors" ADD CONSTRAINT "donors_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sos_requests" ADD CONSTRAINT "sos_requests_requester_id_fkey" FOREIGN KEY ("requester_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_logs" ADD CONSTRAINT "contact_logs_sos_id_fkey" FOREIGN KEY ("sos_id") REFERENCES "sos_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_logs" ADD CONSTRAINT "contact_logs_donor_id_fkey" FOREIGN KEY ("donor_id") REFERENCES "donors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_logs" ADD CONSTRAINT "contact_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
