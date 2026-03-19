import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')
  const pwd = await bcrypt.hash('demo1234', 12)

  // Demo attorney
  const attorney = await prisma.user.upsert({
    where: { email: 'demo@immigai.com' },
    update: {},
    create: { email: 'demo@immigai.com', name: 'Sarah Chen', password: pwd, role: 'attorney', firm: 'Chen & Associates' },
  })

  // Demo org + corporate admin
  const org = await prisma.organization.upsert({
    where: { id: 'org-techcorp' },
    update: {},
    create: { id: 'org-techcorp', name: 'TechCorp Inc.', domain: 'techcorp.com' },
  })
  const corpAdmin = await prisma.user.upsert({
    where: { email: 'admin@techcorp.com' },
    update: {},
    create: { email: 'admin@techcorp.com', name: 'Mike Rodriguez', password: pwd, role: 'corporate_admin', organizationId: org.id },
  })

  console.log(`✅ Users: ${attorney.email}, ${corpAdmin.email}`)

  const now = new Date()
  function daysAgo(n: number) { return new Date(now.getTime() - n * 86400000) }
  function daysFrom(n: number) { return new Date(now.getTime() + n * 86400000) }

  const cases = [
    // ── Family ──────────────────────────────────────────────────────────────
    {
      caseType: 'family', visaCategory: 'Marriage Green Card', currentStage: 'USCIS Review',
      status: 'active', applicantName: 'Zhang, Wei', petitionerName: 'Zhang, Emily (USC)',
      petitionerType: 'individual', approvalProbabilityScore: 88, estimatedProcessingTime: 18,
      checklist: [
        { itemLabel: 'Form I-130', category: 'form', formCode: 'I-130', required: true, completed: true },
        { itemLabel: 'Form I-485', category: 'form', formCode: 'I-485', required: true, completed: true },
        { itemLabel: 'Form I-864 Affidavit of Support', category: 'form', formCode: 'I-864', required: true, completed: true },
        { itemLabel: 'Marriage Certificate', category: 'document', required: true, completed: true },
        { itemLabel: 'Joint bank account statements', category: 'document', required: true, completed: true },
        { itemLabel: 'Joint lease agreement', category: 'document', required: true, completed: false },
        { itemLabel: 'Wedding photos (10+)', category: 'document', required: true, completed: false },
        { itemLabel: 'Medical Exam (I-693)', category: 'form', formCode: 'I-693', required: true, completed: false },
        { itemLabel: 'Biometrics appointment attended', category: 'action', required: true, completed: true },
        { itemLabel: 'USCIS Interview', category: 'action', required: true, completed: false },
      ],
      timeline: [
        { eventType: 'created',      title: 'Case Opened',         description: 'Marriage green card case initiated.',         daysAgo: 90,  isAutomated: true  },
        { eventType: 'stage_change', title: 'I-130 + I-485 Filed', description: 'Concurrent petition filed.',                  daysAgo: 60,  isAutomated: false },
        { eventType: 'biometrics',   title: 'Biometrics Completed', description: 'Fingerprints taken at local ASC.',           daysAgo: 30,  isAutomated: false },
        { eventType: 'note',         title: 'Interview Scheduled', description: 'Interview at San Francisco field office.',    daysAgo: 5,   isAutomated: true  },
      ],
      deadlines: [
        { deadlineType: 'interview', title: 'USCIS Interview', description: 'Field office interview', daysFrom: 25, completed: false, alertDays: 14 },
      ],
    },
    {
      caseType: 'family', visaCategory: 'K-1 Fiancé Visa', currentStage: 'Petition Preparation',
      status: 'active', applicantName: 'Rossi, Marco', petitionerName: 'Johnson, Lisa (USC)',
      petitionerType: 'individual', approvalProbabilityScore: 85, estimatedProcessingTime: 12,
      checklist: [
        { itemLabel: 'Form I-129F', category: 'form', formCode: 'I-129F', required: true, completed: true },
        { itemLabel: 'Proof of meeting in person (2 years)', category: 'document', required: true, completed: true },
        { itemLabel: 'Photos together (10+)', category: 'document', required: true, completed: false },
        { itemLabel: 'Communication records', category: 'document', required: true, completed: false },
        { itemLabel: 'Intent to marry statement', category: 'action', required: true, completed: true },
        { itemLabel: 'I-129F filing fee paid ($675)', category: 'fee', required: true, completed: true },
      ],
      timeline: [
        { eventType: 'created',      title: 'K-1 Case Opened',   description: 'K-1 fiancé visa petition initiated.',            daysAgo: 14, isAutomated: true  },
        { eventType: 'stage_change', title: 'I-129F Filed',      description: 'K-1 petition filed with USCIS.',                  daysAgo: 7,  isAutomated: false },
      ],
      deadlines: [
        { deadlineType: 'filing', title: 'USCIS Processing', description: 'Awaiting NOA1', daysFrom: 100, completed: false, alertDays: 7 },
      ],
    },
    // ── Employment ───────────────────────────────────────────────────────────
    {
      caseType: 'employment', visaCategory: 'H-1B', currentStage: 'USCIS Review',
      status: 'submitted', applicantName: 'Patel, Raj', petitionerName: 'TechCorp Inc.',
      petitionerType: 'company', approvalProbabilityScore: 82, estimatedProcessingTime: 8,
      organizationId: org.id,
      checklist: [
        { itemLabel: 'Form I-129', category: 'form', formCode: 'I-129', required: true, completed: true },
        { itemLabel: 'LCA Certified (ETA-9035)', category: 'form', formCode: 'ETA-9035', required: true, completed: true },
        { itemLabel: 'Employer support letter', category: 'document', required: true, completed: true },
        { itemLabel: 'Degree certificates', category: 'document', required: true, completed: true },
        { itemLabel: 'All filing fees paid', category: 'fee', required: true, completed: true },
      ],
      timeline: [
        { eventType: 'created',      title: 'Case Opened',     description: 'H-1B petition initiated for Raj Patel at TechCorp.',  daysAgo: 45, isAutomated: true  },
        { eventType: 'stage_change', title: 'LCA Certified',   description: 'DOL certified the LCA.',                              daysAgo: 35, isAutomated: false },
        { eventType: 'stage_change', title: 'I-129 Filed',     description: 'H-1B petition filed with USCIS premium processing.',   daysAgo: 20, isAutomated: false },
      ],
      deadlines: [],
    },
    {
      caseType: 'employment', visaCategory: 'EB-2 NIW', currentStage: 'RFE Response',
      status: 'rfe_received', applicantName: 'Garcia, Ana', petitionerName: 'Ana Garcia (Self)',
      petitionerType: 'individual', approvalProbabilityScore: 71, estimatedProcessingTime: 18,
      checklist: [
        { itemLabel: 'Form I-140', category: 'form', formCode: 'I-140', required: true, completed: true },
        { itemLabel: 'NIW support statement', category: 'document', required: true, completed: true },
        { itemLabel: 'Expert letters (3 required)', category: 'document', required: true, completed: false },
        { itemLabel: 'Publication list + full papers', category: 'document', required: true, completed: true },
        { itemLabel: 'RFE response draft', category: 'action', required: true, completed: false },
        { itemLabel: 'Citation evidence', category: 'document', required: true, completed: true },
      ],
      timeline: [
        { eventType: 'created',      title: 'Case Opened',        description: 'EB-2 NIW self-petition initiated.',                        daysAgo: 120, isAutomated: true  },
        { eventType: 'stage_change', title: 'I-140 Filed',        description: 'Petition filed at Nebraska Service Center.',               daysAgo: 90,  isAutomated: false },
        { eventType: 'rfe',          title: 'RFE Received',       description: 'USCIS requested additional evidence of national interest.',  daysAgo: 10,  isAutomated: true  },
        { eventType: 'note',         title: 'AI Draft Generated', description: 'AI generated RFE response draft for attorney review.',      daysAgo: 5,   isAutomated: true  },
      ],
      deadlines: [
        { deadlineType: 'rfe_response', title: 'RFE Response Due', description: 'USCIS RFE response must be submitted', daysFrom: 77, completed: false, alertDays: 14 },
      ],
    },
    {
      caseType: 'employment', visaCategory: 'L-1A', currentStage: 'Attorney Review',
      status: 'active', applicantName: 'Kim, Ji-Yeon', petitionerName: 'TechCorp Inc.',
      petitionerType: 'company', approvalProbabilityScore: 80, estimatedProcessingTime: 6,
      organizationId: org.id,
      checklist: [
        { itemLabel: 'Form I-129 L Classification', category: 'form', formCode: 'I-129', required: true, completed: true },
        { itemLabel: 'Qualifying relationship proof', category: 'document', required: true, completed: true },
        { itemLabel: 'Managerial capacity evidence', category: 'document', required: true, completed: false },
        { itemLabel: 'Org charts (both companies)', category: 'document', required: true, completed: false },
        { itemLabel: '1-year abroad employment proof', category: 'document', required: true, completed: true },
      ],
      timeline: [
        { eventType: 'created',   title: 'Case Opened',          description: 'L-1A intracompany transferee petition initiated.',  daysAgo: 20, isAutomated: true  },
        { eventType: 'document',  title: 'Initial Docs Received', description: 'Qualifying relationship documents submitted.',      daysAgo: 10, isAutomated: false },
      ],
      deadlines: [
        { deadlineType: 'filing', title: 'File I-129', description: 'Submit L-1A petition to USCIS', daysFrom: 14, completed: false, alertDays: 7 },
      ],
    },
    // ── Investor ─────────────────────────────────────────────────────────────
    {
      caseType: 'investor', visaCategory: 'EB-5', currentStage: 'Investment Verification',
      status: 'active', applicantName: 'Hassan, Omar', petitionerName: 'Hassan Family Holdings',
      petitionerType: 'individual', approvalProbabilityScore: 68, estimatedProcessingTime: 36,
      checklist: [
        { itemLabel: 'Form I-526E', category: 'form', formCode: 'I-526E', required: true, completed: false },
        { itemLabel: 'Source of funds (5-year history)', category: 'document', required: true, completed: true },
        { itemLabel: 'Investment business plan', category: 'document', required: true, completed: false },
        { itemLabel: 'Regional center approval docs', category: 'document', required: true, completed: true },
        { itemLabel: 'Job creation evidence (10 jobs)', category: 'document', required: true, completed: false },
        { itemLabel: 'I-526E fee paid ($11,160)', category: 'fee', required: true, completed: false },
      ],
      timeline: [
        { eventType: 'created',   title: 'EB-5 Case Opened',    description: 'EB-5 investor visa initiated. Source of funds review in progress.',  daysAgo: 30, isAutomated: true  },
        { eventType: 'document',  title: 'Investment Verified', description: 'Regional center and investment amount verified.',                      daysAgo: 10, isAutomated: false },
      ],
      deadlines: [
        { deadlineType: 'filing',     title: 'File I-526E',           description: 'Submit EB-5 petition to USCIS', daysFrom: 30, completed: false, alertDays: 14 },
        { deadlineType: 'fee_payment','title': 'I-526E Fee ($11,160)', description: 'Pay EB-5 filing fee',           daysFrom: 30, completed: false, alertDays: 7  },
      ],
    },
    // ── Student ──────────────────────────────────────────────────────────────
    {
      caseType: 'student', visaCategory: 'F-1', currentStage: 'Embassy Interview',
      status: 'active', applicantName: 'Novak, Elena', petitionerName: 'MIT (Sponsor)',
      petitionerType: 'company', approvalProbabilityScore: 90, estimatedProcessingTime: 3,
      checklist: [
        { itemLabel: 'DS-160 submitted', category: 'form', formCode: 'DS-160', required: true, completed: true },
        { itemLabel: 'I-20 from SEVIS institution', category: 'form', formCode: 'I-20', required: true, completed: true },
        { itemLabel: 'SEVIS fee paid (I-901)', category: 'fee', required: true, completed: true },
        { itemLabel: 'University acceptance letter', category: 'document', required: true, completed: true },
        { itemLabel: 'Financial support evidence (1 year)', category: 'document', required: true, completed: true },
        { itemLabel: 'Bank statements', category: 'document', required: true, completed: true },
        { itemLabel: 'Embassy interview attended', category: 'action', required: true, completed: false },
        { itemLabel: 'Visa application fee ($185)', category: 'fee', required: true, completed: true },
      ],
      timeline: [
        { eventType: 'created',      title: 'F-1 Case Opened',     description: 'F-1 student visa case initiated.',                              daysAgo: 21, isAutomated: true  },
        { eventType: 'document',     title: 'I-20 Received',       description: 'I-20 received from MIT. SEVIS fee paid.',                       daysAgo: 14, isAutomated: false },
        { eventType: 'stage_change', title: 'DS-160 Submitted',    description: 'Visa application submitted. Interview scheduled.',               daysAgo: 7,  isAutomated: false },
      ],
      deadlines: [
        { deadlineType: 'interview', title: 'Embassy Interview', description: 'F-1 visa interview at US Consulate', daysFrom: 7, completed: false, alertDays: 3 },
      ],
    },
  ]

  for (const c of cases as any[]) {
    const created = await prisma.case.create({
      data: {
        userId:                  attorney.id,
        organizationId:          c.organizationId ?? null,
        caseType:                c.caseType,
        visaCategory:            c.visaCategory,
        currentStage:            c.currentStage,
        status:                  c.status,
        applicantName:           c.applicantName,
        petitionerName:          c.petitionerName,
        petitionerType:          c.petitionerType,
        approvalProbabilityScore: c.approvalProbabilityScore,
        estimatedProcessingTime: c.estimatedProcessingTime,
        estimatedCompletionDate: daysFrom(c.estimatedProcessingTime * 30),
        checklistItems: {
          create: c.checklist.map((item: any, i: number) => ({ ...item, sortOrder: i, formCode: item.formCode ?? null })),
        },
      },
    })
    for (let i = 0; i < c.timeline.length; i++) {
      const t = c.timeline[i]
      await prisma.timelineEvent.create({
        data: { caseId: created.id, eventType: t.eventType, title: t.title, description: t.description, eventDate: daysAgo(t.daysAgo), isAutomated: t.isAutomated, notificationSent: true },
      })
    }
    for (const dl of c.deadlines as any[]) {
      await prisma.deadlineEvent.create({
        data: { caseId: created.id, deadlineType: dl.deadlineType, title: dl.title, description: dl.description, dueDate: daysFrom(dl.daysFrom), completed: dl.completed, alertDays: dl.alertDays },
      })
    }
    console.log(`✅ ${c.caseType.toUpperCase()} | ${c.applicantName} (${c.visaCategory})`)
  }

  console.log('\n🎉 Seeding complete!')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('  Attorney:       demo@immigai.com / demo1234')
  console.log('  Corporate Admin: admin@techcorp.com / demo1234')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
