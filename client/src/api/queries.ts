const askQuestion = async () => {
  const res = await fetch("https://localhost:8000/api/");
  return res.json();
}
