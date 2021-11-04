import fs from 'fs';

export const moveFile = (oldPath: string, newPath: string) => {
  fs.readFile(oldPath, function (err, data) {
    if (err) throw err;

    fs.writeFile(newPath, data, function (err) {
      if (err) throw err;
    });

    fs.unlink(oldPath, function (err) {
      if (err) throw err;
    });
  });
}