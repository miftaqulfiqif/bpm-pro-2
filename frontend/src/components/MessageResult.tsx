export const MessageResult = ({ message }: { message: any }) => {
    console.log(Object.keys(message).length);

  return (
    <div className="">
        <p>Hasil Pengukuran</p>
    <table>
      <tbody>
        <tr>
          <td>Systolik</td>
          <td>{`${message.systolic} mmHg`}</td>
        </tr>
        <tr>
          <td>Diastolik</td>
          <td>{`${message.diastolic} mmHg`}</td>
        </tr>
        <tr>
          <td>Tekanan Rata-rata</td>
          <td>{`${message.mean} mmHg`}</td>
        </tr>
        <tr>
          <td>Detak Jantung</td>
          <td>{`${message.heart_rate} bpm`}</td>
        </tr>
      </tbody>
    </table>
    </div>
  );
};
