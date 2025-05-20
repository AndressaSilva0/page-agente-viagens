"use client"
import { useState } from "react"
import { useChat } from "@ai-sdk/react"
import { Send, Settings, Plane } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"

export default function ChatPage() {
  const [systemPrompt, setSystemPrompt] = useState<string>(
    "Você é um Agente de Viagens especializado. Forneça recomendações detalhadas sobre destinos, acomodações, atrações turísticas e dicas de viagem. Ajude os usuários a planejar suas viagens perfeitas com sugestões personalizadas e informações úteis.",
  )
  const [showSystemMessage, setShowSystemMessage] = useState(false)

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    initialMessages: [
      {
        id: "system-1",
        role: "system",
        content: systemPrompt,
      },
    ],
  })

  const applySystemPrompt = () => {
    // Limpar mensagens anteriores e definir nova mensagem de sistema
    setMessages([
      {
        id: "system-1",
        role: "system",
        content: systemPrompt,
      },
    ])
  }

  return (
    <div className="flex flex-col min-h-screen p-4 md:p-8 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Plane className="h-6 w-6 text-primary" />
          Agente de Viagens IA
        </h1>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Configurações do Agente de Viagens</SheetTitle>
              <SheetDescription>
                Personalize como o agente deve responder às suas perguntas sobre viagens
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="system-prompt">Instruções para o Agente</Label>
                <Textarea
                  id="system-prompt"
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  placeholder="Ex: Responda como um especialista em viagens de aventura"
                  className="min-h-32"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="show-system"
                  checked={showSystemMessage}
                  onChange={(e) => setShowSystemMessage(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="show-system">Mostrar instruções no chat</Label>
              </div>
              <Button onClick={applySystemPrompt} className="w-full">
                Aplicar configurações
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex-1 space-y-4 mb-4 overflow-auto">
        {showSystemMessage && messages.length > 0 && messages[0].role === "system" && (
          <Card className="bg-secondary/30 border-dashed">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium">Instruções do Sistema</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 text-sm italic">{messages[0].content}</CardContent>
          </Card>
        )}

        {messages.filter((m) => m.role !== "system").length === 0 ? (
          <Card className="bg-muted/50">
            <CardContent className="p-6 text-center text-muted-foreground">
              Faça uma pergunta sobre viagens para começar
            </CardContent>
          </Card>
        ) : (
          messages
            .filter((m) => m.role !== "system" || showSystemMessage)
            .map((message) => (
              <Card
                key={message.id}
                className={
                  message.role === "user"
                    ? "bg-primary/10"
                    : message.role === "system"
                      ? "bg-secondary/30 border-dashed"
                      : "bg-card"
                }
              >
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {message.role === "user"
                      ? "Você"
                      : message.role === "system"
                        ? "Instruções do Sistema"
                        : "Agente de Viagens"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">{message.content}</CardContent>
              </Card>
            ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <Textarea
          value={input}
          onChange={handleInputChange}
          placeholder="Pergunte sobre destinos, hotéis, pacotes ou dicas de viagem..."
          className="min-h-24 resize-none"
        />
        <Button type="submit" className="self-end" disabled={isLoading || !input.trim()}>
          {isLoading ? "Enviando..." : "Enviar"}
          {!isLoading && <Send className="ml-2 h-4 w-4" />}
        </Button>
      </form>
    </div>
  )
}
