import getStatus, {
  computeAverage,
  EnrollmentStatus
} from "./gradeUtils";

interface Enrollee {
  name: string;
  prelim: number;
  midterm: number;
  final: number;
}

interface EligibilityReport {
  name: string;
  average: number;
  status: EnrollmentStatus;
  remarks?: string;
}

const enrollees: Enrollee[] = [
  { name: "Ana Cruz", prelim: 85, midterm: 90, final: 88 },
  { name: "Bea Santos", prelim: 70, midterm: 65, final: 60 },
  { name: "Cid Ramos", prelim: 95, midterm: 92, final: 97 },
  { name: "Dex Alonzo", prelim: 60, midterm: 55, final: 50 },
  { name: "Eli Tan", prelim: 78, midterm: 80, final: 76 },
];

function getEnrollees(): Promise<Enrollee[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(enrollees);
    }, 1000);
  });
}

function groupBy<T>(
  items: T[],
  keyFn: (item: T) => string
): Record<string, T[]> {
  return items.reduce((groups, item) => {
    const key = keyFn(item);

    if (!groups[key]) {
      groups[key] = [];
    }

    groups[key].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

async function generateReport(): Promise<void> {
  try {
    const students = await getEnrollees();

    console.log(
      "=== IT313 Enrollment Eligibility Report (TypeScript) ==="
    );

    let batchId: string | number =
      Math.random() > 0.5 ? "IT313-2026" : 3132026;

    if (typeof batchId === "string") {
      console.log("Batch ID:", batchId.toUpperCase());
    } else {
      console.log("Batch ID:", batchId.toFixed(0));
    }

    const reports: EligibilityReport[] = students.map((student) => {
      const average = computeAverage(
        student.prelim,
        student.midterm,
        student.final
      );

      const status = getStatus(average);

      return {
        name: student.name,
        average,
        status,
        ...(status === EnrollmentStatus.Probation
          ? { remarks: "Needs consultation" }
          : {})
      };
    });

    const classAverage =
      reports.reduce(
        (sum, report) => sum + report.average,
        0
      ) / reports.length;

    const grouped = groupBy(
      reports,
      (report) => EnrollmentStatus[report.status]
    );

    for (const report of reports) {
      const statusText = EnrollmentStatus[report.status];

      console.log(
        `${report.name} - Average: ${report.average.toFixed(2)} - ${statusText}` +
        (report.remarks ? ` - ${report.remarks}` : "")
      );
    }

    console.log(
      `Class Average: ${classAverage.toFixed(2)}`
    );

    console.log(
      `Passing: ${
        grouped[EnrollmentStatus[EnrollmentStatus.Passing]]?.length ?? 0
      } / ${reports.length}`
    );

  } catch (error) {
    console.error(
      "Failed to connect to registrar:",
      error
    );
  }
}

generateReport();