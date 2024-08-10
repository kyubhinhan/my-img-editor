import HSplitter from '@/app/HSplitter';

export default function Home() {
  const left = <div>왼쪽입니다.</div>;
  const right = <div>오른쪽입니다.</div>;

  return (
    <main>
      <HSplitter left={left} right={right} />
    </main>
  );
}
