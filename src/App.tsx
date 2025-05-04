import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { api } from "./service/api.js";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";

import { Plus, X } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "./components/ui/form";
import { useEffect, useState, useRef } from "react";
import { SearchForm } from "./components/form";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./components/ui/alert-dialog";

const formSchema = z.object({
  name: z.string(),

  description: z.string(),

  link: z.string(),
});

interface Projetos {
  id: string;
  name: string;
  description: string;
  link: string;
  tags: string;
}

export function App() {
  const audioSuccessRef = useRef<HTMLAudioElement>(null);
  const audioErrorRef = useRef<HTMLAudioElement>(null);
  const audioErrorRef2 = useRef<HTMLAudioElement>(null);

  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagsInput] = useState<string>("");
  const [open, setOpen] = useState(false);

  const [projetos, setProjetos] = useState<Projetos[]>([]);

  function insertTag(tag: string) {
    setTags((prevTags) => [...prevTags, tag]);
  }

  async function deleteProjeto(id: string) {
    try {
      await api.delete(`/projetos/${id}`);
      toast.success("Projeto deletado.");
      audioErrorRef2.current?.play();
    } catch {
      toast.error("Erro");
    }
    buscaProjetos("");
    return;
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
      toast.success("Projeto criado!");
      buscaProjetos("");
      setOpen(false);
      audioSuccessRef.current?.play();
    } catch {
      toast.error("Erro ao criar o projeto...");
      audioErrorRef.current?.play();
    }

    return;
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
        <SearchForm buscaProjetos={buscaProjetos} />

        <div className="cards grid grid-cols-1 md:grid-cols-3 gap-4 px-10 py-10">
          {projetos.map((projeto, index) =>
            projeto ? (
              <div
                key={index}
                className="card flex flex-col relative bg-zinc-100 p-5 rounded-2xl shadow-lg"
              >
                <h1 className="text-sm font-bold">{projeto.name}</h1>
                <p className="text-xs">{projeto.description}</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {projeto.tags &&
                    projeto.tags.split(",").map((tag, index) => (
                      <div
                        key={index}
                        className="tag   odd:bg-red-500 even:bg-zinc-950 text-zinc-50 font-bold text-[10px] py-1 px-3 rounded-4xl mt-3"
                      >
                        {tag.trim()}
                      </div>
                    ))}
                </div>
                {projeto.link ? (
                  <Button
                    className="py-0 ml-auto h-6 px-10 rounded-2xl mt-auto"
                    asChild
                  >
                    <a href={projeto.link} target="blank">
                      Acessar
                    </a>
                  </Button>
                ) : null}

                <AlertDialog>
                  <AlertDialogTrigger>
                    <X className="text-zinc-950 cursor-pointer absolute right-2 top-2" />
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-center">
                        Deseja excluir esse projeto ?
                      </AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="!justify-center">
                      <AlertDialogCancel className="cursor-pointer">
                        Não
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="cursor-pointer"
                        onClick={() => deleteProjeto(projeto.id)}
                      >
                        Sim
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ) : null
          )}
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
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

      <audio ref={audioSuccessRef} src="/utils/elegosta.mp3" preload="auto" />
      <audio ref={audioErrorRef} src="/utils/quepapelao.mp3" preload="auto" />
      <audio ref={audioErrorRef2} src="/utils/tome.mp3" preload="auto" />
    </>
  );
}
