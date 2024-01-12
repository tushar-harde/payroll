export const openDialog = () => {
  return new Promise((resolve, reject) => {
    window?.api?.openDirectoryDialog((err, data) => {
      if (!err) {
        resolve(data);
      } else {
        reject(err);
      }
    });
  });
};

export const savePayslips = (payslips, dir = undefined) => {
  return new Promise((resolve, reject) => {
    window?.api?.savePayslips(
      {
        dir,
        payslips,
      },
      (err, data) => {
        if (!err) {
          resolve(data);
        } else {
          reject(err);
        }
      }
    );
  });
};
