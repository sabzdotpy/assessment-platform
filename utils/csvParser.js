/**
 * name,email,phone,dob,group
Ankit Raj,ankit@example.com,9876543210,2000-06-15,Batch A
Sana Iqbal,sana@example.com,9812345678,2001-12-03,Batch B

 */
import csv from "csv-parser";
import { Readable } from "stream";

export const parseCSVBuffer = (buffer) => {
  return new Promise((resolve, reject) => {
    const results = [];

    Readable.from(buffer)
      .pipe(csv()) // uses headers from first row
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", reject);
  });
};
