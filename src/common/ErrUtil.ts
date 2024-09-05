const ErrUtil: {
  assert: (condition: boolean, message?: string) => void;
} = {
  assert: (condition: boolean, message?: string) => {
    if (condition) return;
    else console.error(message);
  },
};

Object.freeze(ErrUtil);
export default ErrUtil;
