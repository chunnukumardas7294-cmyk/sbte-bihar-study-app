import { SubjectNotes } from '../types';

export const SUBJECT_NOTES: SubjectNotes[] = [
  // 1st Year: Applied Mathematics - I
  {
    id: 'notes_math1',
    subjectId: 'sub_math1',
    subjectName: 'Applied Mathematics - I',
    branchId: 'first_year',
    semester: 1,
    passFormulaSummary: 'Target Unit 1 (Algebra - Matrices & Determinants) + Unit 3 (Trigonometry) + Section A 20 MCQs. Unit 1 alone gives 22 marks (Cramer rule 6 marks + Adjoint inverse 4 marks + Matrix addition/multiplication 4 marks + 4 MCQs). Master Cramer Rule to get 6 marks in the first 10 minutes of exam!',
    minimumUnitsToPass: 'Prepare Unit 1 (Determinants & Matrices) and Unit 2 (Binomial & Complex Numbers) thoroughly to secure 35+ marks out of 70 easily.',
    formulaCheatSheet: [
      {
        name: 'Adjoint of Matrix property',
        formula: '|adj(A)| = |A|^(n - 1)',
        variables: 'n = order of square matrix, |A| = determinant',
        application: 'Direct 1-mark Section A MCQ guaranteed every year',
      },
      {
        name: 'Matrix Inverse',
        formula: 'A^(-1) = (1 / |A|) * adj(A)',
        variables: '|A| must not be zero (Non-singular matrix)',
        application: 'Section B 4-mark question: Find inverse of 2x2 or 3x3 matrix',
      },
      {
        name: 'Cramer\'s Rule',
        formula: 'x = Dx / D,  y = Dy / D,  z = Dz / D',
        variables: 'D = coefficient determinant (D ≠ 0)',
        application: 'Section C 6-mark linear equations numerical',
      },
      {
        name: 'De Moivre\'s Theorem',
        formula: '(cos θ + i sin θ)^n = cos(nθ) + i sin(nθ)',
        variables: 'n is any rational number, i = √(-1)',
        application: 'Complex numbers proof question (4 or 6 marks)',
      },
      {
        name: 'General Term in Binomial Expansion',
        formula: 'T_(r + 1) = ^nC_r * x^(n - r) * a^r',
        variables: 'n = power index, r = term index starting from 0',
        application: 'Find middle term or coefficient of x^k',
      },
    ],
    units: [
      {
        unitNumber: 1,
        unitTitle: 'Algebra: Determinants & Matrices',
        hindiTitle: 'सारणिक एवं आव्यूह (Determinants & Matrices)',
        weightageMarks: '20 - 24 Marks',
        isMustDoForPassing: true,
        coreConcepts: [
          {
            title: 'Matrix Multiplication Rules (आव्यूह का गुणन)',
            englishSummary: 'Two matrices A of order m×n and B of order p×q can be multiplied if and only if n = p (columns of A equals rows of B). The resulting matrix AB has order m×q.',
            simpleHindiExplanation: 'सरल शब्दों में: अगर पहली मैट्रिक्स के कॉलम (स्तंभ) की संख्या, दूसरी मैट्रिक्स के रो (पंक्ति) की संख्या के बराबर होगी, तभी गुणा संभव है। SBTE में अक्सर पूछा जाता है कि क्या AB और BA बराबर होते हैं? उत्तर है: सामान्यतः AB ≠ BA (Matrix multiplication is NOT commutative).',
            importantPoints: [
              'Check compatibility: (m×k) * (k×n) = (m×n).',
              'Matrix multiplication is associative: A(BC) = (AB)C.',
              'Identity matrix property: A * I = I * A = A.',
            ],
            examTrick: 'Always verify dimensions before multiplying. Write intermediate row-by-column sums clearly to avoid arithmetic slip-ups.',
          },
          {
            title: 'Cramer\'s Rule (क्रेमर का नियम - 6 अंक पक्के)',
            englishSummary: 'Method of solving simultaneous linear equations using determinants. If D ≠ 0, unique solution exists. If D = 0 and Dx = Dy = Dz = 0, infinitely many solutions exist. If D = 0 and any Dx, Dy, Dz ≠ 0, no solution exists (inconsistent).',
            simpleHindiExplanation: 'यह SBTE का सबसे पसंदीदा 6 नंबर का सवाल है! आपको 3 समीकरण दिए जाएंगे। सबसे पहले D निकालें। अगर D का मान शून्य (0) नहीं आता, तो समझें काम आसान है। फिर Dx, Dy, Dz निकालें और सीधे x = Dx/D, y = Dy/D, z = Dz/D लिख दें।',
            importantPoints: [
              'Write coefficients with proper signs (+ and -).',
              'Double check calculation of 3x3 determinant D.',
              'Substitute x, y, z in any equation on rough page to check if answer matches.',
            ],
            examTrick: 'Put calculated values back into Eq 1. If LHS = RHS, you got full 6/6 marks!',
          },
        ],
        differencesTable: {
          title: 'Difference between Matrix and Determinant (आव्यूह एवं सारणिक में अंतर)',
          col1Header: 'Matrix (आव्यूह)',
          col2Header: 'Determinant (सारणिक)',
          rows: [
            {
              point: 'Shape / Order',
              val1: 'Can be rectangular (m × n) or square',
              val2: 'Must ALWAYS be a square array (n × n)',
            },
            {
              point: 'Numerical Value',
              val1: 'It has no single numerical value; it is an arrangement of elements',
              val2: 'It evaluates to a single numeric scalar value',
            },
            {
              point: 'Brackets',
              val1: 'Enclosed in square brackets [ ] or round brackets ( )',
              val2: 'Enclosed between two vertical straight bars | |',
            },
            {
              point: 'Scalar Multiplication',
              val1: 'Multiplying by k multiplies EVERY element of the matrix',
              val2: 'Multiplying by k multiplies elements of ONLY ONE row or column',
            },
          ],
        },
        goldenQuestions: [
          {
            question: 'Find the adjoint and inverse of matrix A = [[2, 3], [1, 4]].',
            marks: 4,
            simplifiedSolution: '1. |A| = (2*4) - (3*1) = 8 - 3 = 5 ≠ 0.\n2. Cofactors: C11 = 4, C12 = -1, C21 = -3, C22 = 2.\n3. adj(A) = [[4, -3], [-1, 2]] (Quick trick for 2x2: Swap diagonal elements 2 and 4, change signs of off-diagonal 3 and 1).\n4. A^(-1) = (1/5) * [[4, -3], [-1, 2]].',
            diagramTip: 'Enclose the final inverse matrix in clean square brackets with 1/5 outside.',
          },
        ],
      },
    ],
  },

  // 1st Year: Engineering Mechanics
  {
    id: 'notes_mech',
    subjectId: 'sub_mech',
    subjectName: 'Engineering Mechanics',
    branchId: 'first_year',
    semester: 2,
    passFormulaSummary: 'Mechanics pass strategy: Focus on Unit 1 (Coplanar Forces & Lami Theorem) + Unit 2 (Friction) + Unit 3 (Centroid / C.G. of T-section, I-section, L-section). Doing these 3 units guarantees 45+ marks!',
    minimumUnitsToPass: 'Units 1, 2, and 3 are 100% numerical and diagram based. Evaluators in Bihar reward clean free body diagrams (FBD) with full marks.',
    formulaCheatSheet: [
      {
        name: 'Parallelogram Law of Forces',
        formula: 'R = √(P² + Q² + 2PQ cos θ),  tan α = (Q sin θ) / (P + Q cos θ)',
        variables: 'P, Q = forces, θ = angle between them, α = angle of resultant with force P',
        application: 'Find resultant of two concurrent forces',
      },
      {
        name: 'Lami\'s Theorem',
        formula: 'P / sin α = Q / sin β = R / sin γ',
        variables: 'Three coplanar concurrent forces in equilibrium, angles opposite to forces',
        application: 'Find unknown tension in strings or reactions at smooth supports',
      },
      {
        name: 'Frictional Force',
        formula: 'F_limiting = μ * R_N,  μ = tan φ',
        variables: 'μ = coefficient of friction, R_N = normal reaction, φ = angle of friction',
        application: 'Block on horizontal or inclined plane numericals',
      },
      {
        name: 'Centroid of composite section (C.G.)',
        formula: 'X̄ = Σ(a_i * x_i) / Σ(a_i),  Ȳ = Σ(a_i * y_i) / Σ(a_i)',
        variables: 'a_i = area of individual part, x_i, y_i = centroid of that part from reference axes',
        application: 'Calculate C.G. of T-section or Channel section (Guaranteed 6 marks)',
      },
    ],
    units: [
      {
        unitNumber: 1,
        unitTitle: 'Basics of Mechanics & Force Systems',
        hindiTitle: 'बल निकाय एवं संतुलन (Force Systems & Equilibrium)',
        weightageMarks: '18 - 20 Marks',
        isMustDoForPassing: true,
        coreConcepts: [
          {
            title: 'Free Body Diagram (FBD - मुक्त पिंड आरेख)',
            englishSummary: 'A sketch of an isolated body showing all external forces, reactions, gravity (weight), and tension acting on it, completely removing the physical supports.',
            simpleHindiExplanation: 'कमज़ोर छात्रों के लिए सबसे आसान टिप: किसी भी वस्तु को उसके सपोर्ट (दीवार, जमीन, रस्सी) से अलग करके उस पर लगने वाले सारे बलों (Weight नीचे की ओर, Normal Reaction 90 डिग्री पर, Tension रस्सी की दिशा में) को तीर (arrow) बनाकर दर्शाना ही FBD कहलाता है। SBTE में FBD का अलग से 2 नंबर मिलता है!',
            importantPoints: [
              'Weight (W = mg) always acts vertically downward from C.G.',
              'Normal reaction is perpendicular to the contacting surface.',
              'Tension pulls away from the body along the cable.',
            ],
            examTrick: 'Draw FBD large and neat with pencil. Mark all angles clearly.',
          },
          {
            title: 'Lami\'s Theorem Conditions & Application',
            englishSummary: 'If three coplanar forces acting at a point are in equilibrium, each force is proportional to the sine of the angle between the other two forces.',
            simpleHindiExplanation: 'लामी का नियम सिर्फ तब काम करता है जब ठीक 3 बल एक ही बिंदु पर मिल रहे हों और वस्तु संतुलन में हो। सूत्र: P/sin(सामने वाला कोण) = Q/sin(सामने वाला कोण) = R/sin(सामने वाला कोण)।',
            importantPoints: [
              'Only valid for THREE forces (not 2, not 4).',
              'Forces must be either all pulling outward or all pushing inward.',
              'Sum of three angles must be 360 degrees.',
            ],
          },
        ],
        differencesTable: {
          title: 'Difference between Static and Dynamic Friction',
          col1Header: 'Static Friction (स्थैतिक घर्षण)',
          col2Header: 'Dynamic / Kinetic Friction (गतिक घर्षण)',
          rows: [
            {
              point: 'State of Motion',
              val1: 'Acts when body is at rest (no actual motion yet)',
              val2: 'Acts when body is in actual motion over surface',
            },
            {
              point: 'Magnitude',
              val1: 'Self-adjusting from 0 to maximum limiting value',
              val2: 'Constant magnitude for a given velocity',
            },
            {
              point: 'Coefficient (μ)',
              val1: 'Coefficient of static friction (μ_s) is higher',
              val2: 'Coefficient of kinetic friction (μ_k) is lower (μ_s > μ_k)',
            },
          ],
        },
        goldenQuestions: [
          {
            question: 'A sphere of weight 500 N rests between two smooth planes inclined at 60° and 30° to horizontal. Find the reactions at contact points using Lami\'s Theorem.',
            marks: 6,
            simplifiedSolution: '1. Draw FBD of sphere: Reactions R1 (perpendicular to 60° plane) and R2 (perpendicular to 30° plane) pass through center. Weight 500 N acts downward.\n2. Angle between R1 and R2 is 90°. Angle between R1 and W is 150°. Angle between R2 and W is 120°.\n3. By Lami\'s theorem: W/sin(90°) = R1/sin(120°) = R2/sin(150°).\n4. 500/1 = R1/sin(60°) => R1 = 500 * (√3/2) = 433.01 N.\n5. R2 = 500 * sin(30°) = 500 * 0.5 = 250 N.',
            diagramTip: 'Draw sphere, the two inclined planes, and three arrows meeting at sphere center.',
          },
        ],
      },
    ],
  },

  // Civil: SOM (Mechanics of Materials)
  {
    id: 'notes_ce_som',
    subjectId: 'sub_ce_som',
    subjectName: 'Mechanics of Materials / SOM',
    branchId: 'ce',
    semester: 3,
    passFormulaSummary: 'SOM Passing Strategy: Unit 1 (Simple Stresses & Strain) + Unit 3 (SFD & BMD) are compulsory! SFD & BMD will come in Section C for 6 marks and Section B for 4 marks. Total 20+ marks from SFD/BMD and stress calculations alone.',
    minimumUnitsToPass: 'Master Stress-Strain diagram of Mild Steel + SFD/BMD of Simply Supported & Cantilever beams. This alone guarantees 30+ marks.',
    formulaCheatSheet: [
      {
        name: 'Stress and Strain',
        formula: 'σ = P / A,  ε = ΔL / L,  E = σ / ε (Hooke\'s Law)',
        variables: 'σ = stress (N/mm²), P = load, A = area, ΔL = change in length, E = Young\'s Modulus',
        application: 'Direct calculation of elongation in bars',
      },
      {
        name: 'Elongation of Uniform Bar',
        formula: 'ΔL = (P * L) / (A * E)',
        variables: 'P = axial load, L = length, A = cross-sectional area, E = modulus',
        application: 'Guaranteed 4-mark numerical on bar elongation',
      },
      {
        name: 'Elongation due to Self Weight',
        formula: 'ΔL = (w * L²) / (2 * E) = (W * L) / (2 * A * E)',
        variables: 'w = specific weight (unit weight), W = total self weight of bar',
        application: 'Direct 1-mark objective or 4-mark short question',
      },
      {
        name: 'Bending Equation (फ्लेक्सर फॉर्मूला)',
        formula: 'M / I = σ_b / y = E / R',
        variables: 'M = Bending moment, I = Moment of inertia, σ_b = bending stress, y = distance from neutral axis, R = radius of curvature',
        application: 'Calculate maximum bending stress or Section Modulus Z = I/y_max',
      },
      {
        name: 'Torsion Equation',
        formula: 'T / J = τ / r = (G * θ) / L',
        variables: 'T = Torque, J = Polar MOI, τ = Shear stress, r = radius, G = Modulus of rigidity, θ = angle of twist',
        application: 'Shaft design numerical',
      },
    ],
    units: [
      {
        unitNumber: 1,
        unitTitle: 'Simple Stresses and Strains',
        hindiTitle: 'साधारण प्रतिबल एवं विकृति (Simple Stresses & Strains)',
        weightageMarks: '16 - 18 Marks',
        isMustDoForPassing: true,
        coreConcepts: [
          {
            title: 'Stress-Strain Curve for Mild Steel (मृदु इस्पात का प्रतिबल-विकृति आरेख)',
            englishSummary: 'Shows material behavior under tension. Key points: A (Proportional limit), B (Elastic limit), C (Upper yield point), D (Lower yield point), E (Ultimate stress), F (Breaking / Fracture point).',
            simpleHindiExplanation: 'यह प्रश्न पिछले 10 सालों में 7 बार पूछा गया है! पेंसिल से एक ग्राफ बनाएं: X-अक्ष पर Strain (विकृति) और Y-अक्ष पर Stress (प्रतिबल)। 6 मुख्य बिंदु मार्क करें: 1. Limit of Proportionality (जहां तक हुक का नियम लागू है), 2. Elastic Limit, 3. Yield Point, 4. Ultimate Tensile Strength (सर्वाधिक क्षमता), 5. Breaking Point (तार टूटने का बिंदु)।',
            importantPoints: [
              'Hooke\'s law holds strictly up to Point A (Proportional Limit).',
              'Plastic deformation begins after Point B.',
              'Necking starts at Point E (Ultimate stress).',
            ],
            examTrick: 'Label all 6 points with capital letters and write 2 lines for each. Guaranteed 6 marks!',
          },
        ],
        differencesTable: {
          title: 'Difference between Ductile and Brittle Materials',
          col1Header: 'Ductile Material (तन्य पदार्थ - e.g. Mild Steel)',
          col2Header: 'Brittle Material (भंगुर पदार्थ - e.g. Cast Iron)',
          rows: [
            {
              point: 'Deformation before fracture',
              val1: 'Undergoes large plastic deformation and necking before failure',
              val2: 'Fails suddenly without noticeable warning or deformation',
            },
            {
              point: 'Stress-Strain Diagram',
              val1: 'Has distinct yield point, ultimate stress, and long curve',
              val2: 'Linear curve up to fracture, no distinct yield point',
            },
            {
              point: 'Example',
              val1: 'Mild steel, Copper, Aluminium',
              val2: 'Cast iron, Concrete, Glass',
            },
          ],
        },
        goldenQuestions: [
          {
            question: 'A steel rod of 20 mm diameter and 2 m length is subjected to an axial pull of 40 kN. If E = 2 × 10^5 N/mm², find: (i) Stress (ii) Strain (iii) Elongation.',
            marks: 4,
            simplifiedSolution: '1. Area A = (π/4) * d² = (π/4) * (20)² = 314.16 mm².\n2. Axial Pull P = 40 kN = 40,000 N; Length L = 2000 mm.\n3. Stress σ = P / A = 40,000 / 314.16 = 127.32 N/mm².\n4. Strain ε = σ / E = 127.32 / (2 × 10^5) = 0.0006366 (No unit).\n5. Elongation ΔL = (P*L)/(A*E) = (40000 * 2000) / (314.16 * 2*10^5) = 1.273 mm.',
            diagramTip: 'Draw a cylindrical bar showing two arrows of 40 kN pulling outward at ends.',
          },
        ],
      },
    ],
  },

  // Electrical: Circuits & Networks
  {
    id: 'notes_ee_circuits',
    subjectId: 'sub_ee_circuits',
    subjectName: 'Electrical Circuits & Networks',
    branchId: 'ee',
    semester: 3,
    passFormulaSummary: 'Circuit Theory Pass Mantra: Network Theorems (Thevenin, Norton, Superposition, Maximum Power Transfer) represent 30 marks out of 70! Just master the step-by-step method to find R_th and V_th, and you will easily pass.',
    minimumUnitsToPass: 'Units 1 (Circuit Analysis Basics) & Unit 2 (Network Theorems) will yield over 35 marks.',
    formulaCheatSheet: [
      {
        name: 'Ohm\'s Law & Power',
        formula: 'V = I * R,  P = V * I = I² * R = V² / R',
        variables: 'V in Volts, I in Amperes, R in Ohms, P in Watts',
        application: 'Basic circuit loop analysis',
      },
      {
        name: 'Thevenin\'s Equivalent Voltage (V_th)',
        formula: 'V_th = Open Circuit Voltage across load terminals A-B',
        variables: 'Disconnect load resistor R_L, find V_OC',
        application: 'Network simplification',
      },
      {
        name: 'Thevenin\'s Equivalent Resistance (R_th)',
        formula: 'R_th = Resistance looking back into terminals with all independent sources killed',
        variables: 'Voltage sources -> Short circuit; Current sources -> Open circuit',
        application: 'Core step for Thevenin and Norton theorem',
      },
      {
        name: 'Norton\'s Equivalent Current (I_sc)',
        formula: 'I_N = Short circuit current across load terminals A-B,  R_N = R_th',
        variables: 'I_N = V_th / R_th (Source transformation)',
        application: 'Norton theorem equivalent',
      },
      {
        name: 'Resonance in Series RLC Circuit',
        formula: 'f_r = 1 / (2π * √(L * C)),  Z_min = R (Impedance is pure resistive, current maximum)',
        variables: 'L in Henry, C in Farad, f_r in Hertz',
        application: 'AC Circuits 4-mark derivation',
      },
    ],
    units: [
      {
        unitNumber: 2,
        unitTitle: 'Network Theorems (नेटवर्क प्रमेय)',
        hindiTitle: 'नेटवर्क प्रमेय (Theorems)',
        weightageMarks: '24 - 28 Marks',
        isMustDoForPassing: true,
        coreConcepts: [
          {
            title: 'Step-by-Step Thevenin\'s Theorem Method',
            englishSummary: 'Any linear, bilateral DC network with voltage/current sources and resistances can be replaced by an equivalent circuit containing a single voltage source V_th in series with resistance R_th.',
            simpleHindiExplanation: 'थेवेनिन प्रमेय का सवाल कैसे हल करें (4 आसान स्टेप्स):\nस्टेप 1: जिस रेजिस्टेंस (R_L) में करंट निकालना है, उसे परिपथ से हटा दें (Remove R_L).\nस्टेप 2: खुले हुए दोनों सिरों (A और B) के बीच वोल्टेज निकालें। यही V_th (Thevenin Voltage) है।\nस्टेप 3: R_th निकालने के लिए सारे वोल्टेज सोर्स को तार से जोड़ दें (Short Circuit) और करंट सोर्स को हटा दें (Open Circuit)। अब A-B सिरों से अंदर देखने पर जो प्रतिरोध मिले, वही R_th है।\nस्टेप 4: Thevenin Circuit बनाएं (V_th के साथ R_th सीरीज में) और R_L जोड़ दें। करंट का सूत्र: I_L = V_th / (R_th + R_L)।',
            importantPoints: [
              'Voltage source -> Short Circuit (0 internal resistance).',
              'Current source -> Open Circuit (infinite internal resistance).',
              'Draw the final equivalent circuit with R_L connected.',
            ],
            examTrick: 'Even if your numerical value has a slight calculation mistake, writing the 4 steps clearly gives 5 out of 6 marks!',
          },
        ],
        differencesTable: {
          title: 'Difference between Thevenin and Norton Theorem',
          col1Header: 'Thevenin\'s Theorem',
          col2Header: 'Norton\'s Theorem',
          rows: [
            {
              point: 'Equivalent Source',
              val1: 'Equivalent Voltage source (V_th)',
              val2: 'Equivalent Current source (I_N or I_sc)',
            },
            {
              point: 'Internal Resistance Placement',
              val1: 'R_th is connected in SERIES with V_th',
              val2: 'R_N is connected in PARALLEL with I_N',
            },
            {
              point: 'Conversion Formula',
              val1: 'V_th = I_N * R_th',
              val2: 'I_N = V_th / R_th (where R_N = R_th)',
            },
          ],
        },
        goldenQuestions: [
          {
            question: 'State Kirchhoff\'s Current Law (KCL) and Kirchhoff\'s Voltage Law (KVL) with diagrams.',
            marks: 4,
            simplifiedSolution: '1. KCL (Junction Rule):\n- Statement: "The algebraic sum of all currents entering and leaving a node in an electric circuit is equal to zero: Σ I = 0."\n- Principle: Based on Law of Conservation of Electric Charge.\n\n2. KVL (Loop Rule):\n- Statement: "In any closed loop of an electric circuit, the algebraic sum of all electromotive forces (EMFs) and potential drops (I*R) is zero: Σ V = 0."\n- Principle: Based on Law of Conservation of Energy.',
            diagramTip: 'Draw a node with 4 arrows (I1, I2 entering; I3, I4 leaving). Draw a simple loop with battery and two resistors.',
          },
        ],
      },
    ],
  },

  // CSE: DBMS
  {
    id: 'notes_cse_dbms',
    subjectId: 'sub_cse_dbms',
    subjectName: 'Database Management Systems (DBMS)',
    branchId: 'cse',
    semester: 3,
    passFormulaSummary: 'DBMS is a high-scoring theoretical subject! Key focus areas: 1. Normalization (1NF, 2NF, 3NF, BCNF) - 10 marks guarantee. 2. ER-Diagram symbols & concepts - 6 marks. 3. ACID properties - 4 marks. 4. SQL basic queries (SELECT, INSERT, UPDATE, JOIN) - 6 marks.',
    minimumUnitsToPass: 'Units on ER Model, Relational Model, and Normalization will easily secure 40+ marks out of 70.',
    formulaCheatSheet: [
      {
        name: 'ACID Properties',
        formula: 'A = Atomicity, C = Consistency, I = Isolation, D = Durability',
        variables: 'Transaction Management guarantee principles',
        application: 'Mandatory 4 or 6 mark question in SBTE exams',
      },
      {
        name: 'Candidate Key Definition',
        formula: 'Minimal super key capable of uniquely identifying a tuple',
        variables: 'Primary Key is chosen from candidate keys',
        application: 'Section A & B questions',
      },
    ],
    units: [
      {
        unitNumber: 1,
        unitTitle: 'Introduction to DBMS & ER Model',
        hindiTitle: 'डेटाबेस परिचय एवं ई-आर मॉडल (ER Model)',
        weightageMarks: '18 - 20 Marks',
        isMustDoForPassing: true,
        coreConcepts: [
          {
            title: 'ER Diagram Symbols (ई-आर आरेख के प्रतीक)',
            englishSummary: 'Entity (Rectangle), Weak Entity (Double Rectangle), Attribute (Oval/Ellipse), Key Attribute (Underlined text in oval), Multivalued Attribute (Double Oval), Relationship (Diamond), Identifying Relationship (Double Diamond).',
            simpleHindiExplanation: 'अगर आपको SBTE में अच्छे नंबर चाहिए, तो इन प्रतीकों को याद कर लें:\n- Rectangle (आयत): Entity जैसे Student, Teacher\n- Ellipse (अंडाकार): Attribute जैसे RollNo, Name\n- Underlined Ellipse: Primary Key (जैसे RollNo)\n- Diamond (हीरा): संबंध (Relationship) जैसे Student "studies in" College.\n- Double Ellipse: बहु-मान विशेषता (Multivalued) जैसे Phone Numbers.',
            importantPoints: [
              'Draw with pencil and ruler for neat presentation.',
              'Label cardinality: 1:1, 1:M, M:N.',
            ],
          },
        ],
        differencesTable: {
          title: 'Difference between DDL and DML Commands',
          col1Header: 'DDL (Data Definition Language)',
          col2Header: 'DML (Data Manipulation Language)',
          rows: [
            {
              point: 'Purpose',
              val1: 'Defines and alters database schema and table structure',
              val2: 'Manipulates and manages data stored inside tables',
            },
            {
              point: 'Commands',
              val1: 'CREATE, ALTER, DROP, TRUNCATE',
              val2: 'SELECT, INSERT, UPDATE, DELETE',
            },
            {
              point: 'Rollback',
              val1: 'Cannot be easily rolled back (Auto-commit)',
              val2: 'Can be rolled back using ROLLBACK transaction',
            },
          ],
        },
        goldenQuestions: [
          {
            question: 'Explain ACID properties of database transactions with examples.',
            marks: 6,
            simplifiedSolution: 'A - Atomicity: "All or Nothing". Either all operations of a transaction execute successfully, or none do. (Example: If ₹500 is debited from Account A, it MUST be credited to Account B. If power fails mid-way, money is rolled back).\nC - Consistency: Database remains in a valid state before and after transaction according to all integrity constraints.\nI - Isolation: Multiple transactions executing concurrently do not interfere with each other as if they were running serially.\nD - Durability: Once a transaction commits, its updates are permanently saved in storage, even in case of system crashes.',
            diagramTip: 'Draw 4 distinct boxes labeled A, C, I, D with a bank transfer illustration.',
          },
        ],
      },
    ],
  },
];
