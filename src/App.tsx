import React, { useState } from "react";
import "./App.css";
import jsPDF from "jspdf";
import { Modal, Spinner } from "react-bootstrap";
import { getPayslipHtml } from "./helper/payslipDocHtml";
import { openDialog, savePayslips } from "./renderer";

function App() {
  const [showModal, setShowModal] = useState(false);
  const [payslips, setPayslips] = useState<Payslip[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setShowModal(true);
      if (!event.target.files) {
        return setShowModal(false);
      }
      const file = event.target.files[0];
      if (document.getElementById("myfile")) {
        (document.getElementById("myfile") as HTMLInputElement).files = null;
      }
      if (file) {
        const reader = new FileReader();
        reader.onload = async (e: ProgressEvent<FileReader>) => {
          if (!e.target) return setShowModal(false);
          const csvData = e.target.result;
          if (!csvData) return setShowModal(false);
          const payslipRecords = csvToJson(csvData.toString());
          debugger;
          let payslips = [];
          for (let index = 0; index < payslipRecords.length - 1; index++) {
            let payslip = await generatePayslip(payslipRecords[index])
              .then((e) => e)
              .catch((err) => {
                throw err;
              });
            payslips.push(payslip);
          }
          setPayslips([...payslips]);
          setShowModal(false);
        };
        reader.readAsText(file);
      }
    } catch (error) {
      console.error(error);
      setShowModal(false);
      alert("Failed to generate payslips!");
    }
  };

  function csvToJson(csvText: string) {
    const lines = csvText.split("\n");
    const headers = lines[0].split(",");
    const jsonData = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",");
      const entry: { [k: string]: any } = {};

      for (let j = 0; j < headers.length; j++) {
        entry[headers[j].trim()] = values[j];
      }
      jsonData.push(entry);
    }

    return jsonData as PayslipData[];
  }

  async function generatePayslip(payslip: PayslipData) {
    return new Promise<Payslip>((resolve, reject) => {
      try {
        if (!payslip?.emp_code) reject("Invalid employee code!");
        const doc = new jsPDF();
        doc.html(getPayslipHtml(payslip), {
          callback: async (doc) => {
            let filename = `${payslip?.emp_code}_${payslip?.emp_name}.pdf`;
            let bloburl = doc.output("bloburl");
            let arrayBuffer = doc.output("arraybuffer");
            resolve({
              fileName: `${payslip?.pay_period}/${payslip?.emp_code}_${payslip?.emp_name}_${payslip?.pay_period}.pdf`,
              fileurl: bloburl.toString(),
              arrayBuffer: arrayBuffer,
            });
          },
          margin: [10, 10, 10, 10],
          autoPaging: "text",
          x: 0,
          y: 0,
          width: 190, //target width in the PDF document
          windowWidth: 675, //window width in CSS pixels
        });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  async function saveFiles() {
    try {
      // let dir = await openDialog();
      setShowModal(true);
      let result = await savePayslips(payslips);
      return alert(`File saved successfully! At location ${result?.dir}`);
    } catch (error: any) {
      alert(error.toString());
      // alert("Failed to save files! Please try again.");
    } finally {
      setShowModal(false);
    }
  }

  return (
    <>
      <div className="m-5">
        <div className="upload-btn-wrapper">
          <button className="upload-btn">Upload a file</button>
          <input
            type="file"
            name="myfile"
            id="myfile"
            onClick={(e: any) => (e.target.value = null)}
            onChange={handleFileChange}
            accept=".csv"
          />
        </div>

        {payslips && payslips.length > 0 && (
          <div className="mt-5">
            <div className="row">
              <div className="col-6">
                <h1>Payslips</h1>
              </div>
              <div className="col-6">
                <button className="btn btn-primary" onClick={saveFiles}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                    height="1.5rem"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                    />
                  </svg>
                  <label className="ms-2">Save Files</label>
                </button>
              </div>
            </div>

            <ul>
              {payslips.map((el, i) => (
                <li key={i}>
                  <a href={el.fileurl} target="_blank">
                    {el.fileName}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <Modal
        show={showModal}
        fullscreen={true}
        onHide={() => setShowModal(false)}
      >
        <Modal.Body>
          <div
            style={{
              width: "100vw",
              height: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Spinner
              animation="border"
              style={{ height: "15rem", width: "15rem" }}
            />
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default App;
