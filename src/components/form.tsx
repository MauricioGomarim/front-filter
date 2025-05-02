import { Input } from "../components/ui/input";

interface SearchFormProps {
  buscaProjetos: (valor: string) => void;
}

export function SearchForm({ buscaProjetos }: SearchFormProps) {
  return (
    <form className="px-10 py-10">
      <Input
        placeholder="Pesquisar por projeto..."
        className="text-zinc-950 bg-zinc-50"
        onChange={(e) => buscaProjetos(e.target.value)}
      />
    </form>
  );
}