import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { api } from "./service/api.js";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";

import { Plus } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "./components/ui/form";
import { useEffect, useState } from "react";

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "O nome deve ter no mínimo 2 caracteres." })
    .max(50, { message: "O nome deve ter no máximo 50 caracteres." }),

  description: z
    .string()
    .min(2, { message: "A descrição deve ter no mínimo 2 caracteres." })
    .max(50, { message: "A descrição deve ter no máximo 50 caracteres." }),

  link: z
    .string()
    .min(2, { message: "O link deve ter no mínimo 2 caracteres." })
    .max(50, { message: "O link deve ter no máximo 50 caracteres." }),
});

interface Projetos {
  name: string;
  description: string;
  link: string;
  tags: string;
}

export function App() {
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagsInput] = useState<string>("");

  const [projetos, setProjetos] = useState<Projetos[]>([]);

  function insertTag(tag: string) {
    setTags((prevTags) => [...prevTags, tag]);
    console.log(tags);
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      link: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const data = {
      ...values,
      tags: tags,
    };

    form.reset();
    setTagsInput("");
    setTags([]);

    try {
      await api.post("/projetos", data);
      alert("cadastrado");
      buscaProjetos();
    } catch {
      alert("erro");
    }
  }

  async function buscaProjetos(query?: string) {
    const projetosData = await api.get(`/projetos?search=${query}`);
    setProjetos(projetosData.data);
    return;
  }

  useEffect(() => {
    buscaProjetos("");
  }, []);

  return (
    <>
      <header className="flex justify-center py-4 pb-4 bg-blue-700">
        <div>
          <h1 className="text-xl font-bold text-zinc-50">Filtro AN7</h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto h-screen  ">
        <form className="px-10 py-10">
          <Input
            placeholder="Pesquisar por projeto..."
            className="text-zinc-50"
            onChange={(e) => buscaProjetos(e.target.value)}
          />
        </form>

        <div className="cards grid grid-cols-3 gap-4 px-10 py-10">
          {projetos.map(
            (projeto, index) =>
              projeto && projeto.tags ? (
                <a
                  key={index}
                  href="#"
                  target="blank"
                  className="card bg-zinc-100 p-5 rounded-2xl shadow-lg"
                >
                  <h1 className="text-sm font-bold">{projeto.name}</h1>
                  <p className="text-xs">{projeto.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {/* Aqui é onde separa e faz um novo map */}
                    {projeto.tags.split(",").map((tag, index) => (
                      <div
                        key={index}
                        className="tag bg-red-500 text-zinc-50 font-bold text-xs py-1 px-3 rounded-4xl mt-3"
                      >
                        {tag.trim()}
                      </div>
                    ))}
                  </div>
                </a>
              ) : null // Se o projeto ou tags não existir, não renderiza nada
          )}
        </div>

        <Dialog>
          <DialogTrigger className="bg-blue-700 p-2 rounded-full fixed right-10 bottom-10">
            <Plus className="text-zinc-50 cursor-pointer" />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar site</DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="flex flex-wrap gap-3">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <Input placeholder="Nome" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <Input placeholder="Descrição" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="link"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <Input placeholder="Link" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center gap-3 w-full">
                    <div className="w-full">
                      <Input
                        placeholder="Tags"
                        onChange={(e) => setTagsInput(e.target.value)}
                        value={tagInput}
                      />
                    </div>

                    <Plus
                      className="cursor-pointer"
                      onClick={() => insertTag(tagInput)}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <div className="tag bg-red-500 text-zinc-50 font-bold text-xs py-1 px-3 rounded-4xl mt-3">
                        {tag}
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="bg-blue-700 hover:bg-blue-600 cursor-pointer"
                >
                  Cadastrar
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </main>
    </>
  );
}
