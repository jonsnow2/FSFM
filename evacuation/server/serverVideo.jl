using HttpServer
using WebSockets
using JSON
using Zlib

wsh = WebSocketHandler() do req,client
        allFrames = Array(Float32,0,0)
        last = -1;
        dimen = Array(Float32,2)
        while true
            msg = read(client)
            print(utf8(msg))
            print("\n")
            clientMsg = JSON.parse(utf8(msg))
            sendAnswer = false
            if clientMsg["action"]== "next"
                beginFrame = clientMsg["beginFrame"]
                endFrame = clientMsg["beginFrame"] + clientMsg["numberFrames"] -1
                sendAnswer = true
            elseif clientMsg["action"] == "previous"
                endFrame = clientMsg["beginFrame"] -1
                beginFrame = clientMsg["beginFrame"] - clientMsg["numberFrames"]
                sendAnswer = true
            elseif clientMsg["action"] == "close"
                allFrames = Array(Float32,0,0);
            elseif clientMsg["action"] == "open"
                file = clientMsg["fileName"]
                print("opening connection and loading file: $file\n")
                fileMovie = open("video.log","r")
                m = read(fileMovie,Int64)
                n = read(fileMovie,Int64)
                allFrames = Array(Float32,m,n);
                read!(fileMovie,allFrames)
                close(fileMovie)
                #dimen = size(allFrames)
                print("opened connection and loaded file: $file\n")
                write(client,"OK")
                print("\n send ok")
                print("tamanho:$tamanho")
                print("\n")
            end
            if sendAnswer
                if last != beginFrame
                    tamanho = read(fileMovie,Int64)
                    if tamanho > 0
                        print("fetching data\n")
                        print(beginFrame)
                        print("\n")
                        print(endFrame)
                        print("\n")
                        print(typeof(beginFrame))
                        print("\n")
                        #print(size(allFrames))
                        #print("\n")
                        framesTemp = allFrames[beginFrame:endFrame,:]'
                        hhh = size(framesTemp)
                        print(hhh)
                        print("\n")
                        print(tamanho)
                        print("\n")
                        #compressed = read(fileMovie,Uint8,tamanho)
                        #frames = decompress(compressed)
                        #frames = reshape(framesTemp,1,hhh[1]*hhh[2])
                        #print(size(frames))
                        #print("\n")
                        last = beginFrame
                        write(client, base64(framesTemp))
                    else
                        # avisa que acabou o arquivo
                        write(client, base64(Array(Float32,2)))
                    end
                else
                    # aviso de requisição duplicada.
                    write(client, base64(Array(Float32,1)))
                end
            end
        end
      end

server = Server(wsh)
run(server,8090)
