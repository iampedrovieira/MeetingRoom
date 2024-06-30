import { client } from '../../index'
import {
    LogService,
    MessageEvent,
} from "matrix-bot-sdk";
import { Request, Response } from 'express';

module.exports = {
    async reserve(req: Request, res: Response) {
        var {
            date,
            startTime,
            endTime,
            roomID,
            userName,
            domain,
        } = req.body;
        const externalID = "@" + userName + ":" + process.env.ROOM_ID.split(':')[1]
        let matrix_roomId: string
        const m_room = await client.getJoinedRooms()
        m_room.forEach(room => {
            if (room.split(':')[1] == domain && room != process.env.ROOM_ID) {
                matrix_roomId = room
                LogService.info("REQUEST", matrix_roomId)
            }
        })
        client.sendMessage(matrix_roomId, {
            body: `!reserve ` + externalID + " " + date + " " + startTime + " " + endTime + " " + roomID,
            msgtype: "m.text",
            format: "m.text",
        });
        try {
            await client.on("room.message", async function (roomId, ev) {
                const event = new MessageEvent(ev);
                if (event.isRedacted) return; // Ignore redacted events that come through
                if (event.sender === this.userId) return; // Ignore ourselves
                if (event.messageType !== "m.notice") return; // Ignore non-text messages
                if (roomId !== matrix_roomId) return; //Ignore other chat messages
                if (res.headersSent) return

                const COMMAND_PREFIX = "!";
                const prefixes = [COMMAND_PREFIX, `${this.localpart}:`, `${this.displayName}:`, `${this.userId}:`];
                const prefixUsed = prefixes.find(p => event.textBody.startsWith(p));
                if (!prefixUsed) return;
                const args = event.textBody.substring(prefixUsed.length).trim().split(' ');
                if (args[0] == 'status' && args[1] == externalID && args[2] == 'True') {
                    const reserveid = args[3]
                    const roomName = ""
                    LogService.info("adasda", reserveid)
                    LogService.info("adasda", args)
                    return res.status(201).json({
                        message: "Reservations created",
                        roomname: roomName,
                        reservationid: reserveid
                    });
                }
                if (args[0] == 'status' && args[1] == externalID && args[2] == 'False') {
                    return res.status(203).json({
                        message: "Something is wrong",
                    });
                }
            });

        } catch (error) {
            return res.status(203).json({
                message: "Please,select a room to reserve outside",
            });
        }
    },
    async deleteReserve(req: Request, res: Response) {
        var { reserveid, userName, domain } = req.query;
        const externalID = "@" + userName + ":" + process.env.ROOM_ID.split(':')[1]
        let matrix_roomId: string
        const m_room = await client.getJoinedRooms()
        m_room.forEach(room => {
            if (room.split(':')[1] == domain && room != process.env.ROOM_ID) {
                matrix_roomId = room
                LogService.info("REQUEST", matrix_roomId)
            }
        })
        client.sendMessage(matrix_roomId, {
            body: `!deleteReservation ` + externalID + " " + reserveid,
            msgtype: "m.text",
            format: "m.text",
        });
        try {
            await client.on("room.message", async function (roomId, ev) {
                const event = new MessageEvent(ev);
                if (event.isRedacted) return; // Ignore redacted events that come through
                if (event.sender === this.userId) return; // Ignore ourselves
                if (event.messageType !== "m.notice") return; // Ignore non-text messages
                if (roomId !== matrix_roomId) return; //Ignore other chat messages
                if (res.headersSent) return

                const COMMAND_PREFIX = "!";
                const prefixes = [COMMAND_PREFIX, `${this.localpart}:`, `${this.displayName}:`, `${this.userId}:`];
                const prefixUsed = prefixes.find(p => event.textBody.startsWith(p));
                if (!prefixUsed) return;
                const args = event.textBody.substring(prefixUsed.length).trim().split(' ');
                if (args[0] == 'status' && args[1] == 'deleteReservation' && args[2] == externalID && args[3] == 'True') {

                    return res.json({ message: "sucesso" });
                }
                if (args[0] == 'status' && args[1] == 'deleteReservation' && args[2] == externalID && args[3] == 'False') {
                    return res.json({ message: "error" });
                }
            });

        } catch (error) {
            return res.json({ message: "error" });
        }
    },
    async lastUserReseves(req: Request, res: Response) {
        var { userName, domain, officeid } = req.body;
        const externalID = "@" + userName + ":" + process.env.ROOM_ID.split(':')[1]
        let matrix_roomId: string
        const m_room = await client.getJoinedRooms()
        m_room.forEach(room => {
            if (room.split(':')[1] == domain && room != process.env.ROOM_ID) {
                matrix_roomId = room
                LogService.info("REQUEST", matrix_roomId)
            }
        })
        client.sendMessage(matrix_roomId, {
            body: `!lastReserves ` + externalID + " " + officeid,
            msgtype: "m.text",
            format: "m.text",
        });
        try {
            await client.on("room.message", async function (roomId, ev) {
                const event = new MessageEvent(ev);
                if (event.isRedacted) return; // Ignore redacted events that come through
                if (event.sender === this.userId) return; // Ignore ourselves
                if (event.messageType !== "m.notice") return; // Ignore non-text messages
                if (roomId !== matrix_roomId) return; //Ignore other chat messages
                if (res.headersSent) return

                const COMMAND_PREFIX = "!";
                const prefixes = [COMMAND_PREFIX, `${this.localpart}:`, `${this.displayName}:`, `${this.userId}:`];
                const prefixUsed = prefixes.find(p => event.textBody.startsWith(p));
                if (!prefixUsed) return;
                const args = event.textBody.substring(prefixUsed.length).trim().split(' ');
                if (args[0] == 'status' && args[1] == 'lastReserves' && args[2] == externalID && args[3] == 'True') {
                    const list = JSON.parse(args[4])
                    for (const rooms of list) {
                        rooms.officeid = rooms.officeid + '-' + process.env.ROOM_ID.split(':')[1]
                    }
                    return res.json(list)
                }
                if (args[0] == 'status' && args[1] == 'deleteReservation' && args[2] == externalID && args[3] == 'False') {
                    return res.status(203).json({
                        message: "Something is wrong",
                    });
                }
            });

        } catch (error) {
            return res.status(203).json({
                message: "Please,select a room to reserve outside",
            });
        }
    },
    async getReservationsByDay(req: Request, res: Response) {
        const { roomid, initdate, domain } = req.query;
        let matrix_roomId: string
        const m_room = await client.getJoinedRooms()
        m_room.forEach(room => {
            if (room.split(':')[1] == domain && room != process.env.ROOM_ID) {
                matrix_roomId = room
            }
        })
        client.sendMessage(matrix_roomId, {
            body: `!reservationsByRoomDate ` + roomid + " " + initdate,
            msgtype: "m.text",
            format: "m.text",
        });
        try {
            await client.on("room.message", async function (roomId, ev) {
                const event = new MessageEvent(ev);
                if (event.isRedacted) return; // Ignore redacted events that come through
                if (event.sender === this.userId) return; // Ignore ourselves
                if (event.messageType !== "m.notice") return; // Ignore non-text messages
                if (roomId !== matrix_roomId) return; //Ignore other chat messages
                if (res.headersSent) return

                const COMMAND_PREFIX = "!";
                const prefixes = [COMMAND_PREFIX, `${this.localpart}:`, `${this.displayName}:`, `${this.userId}:`];
                const prefixUsed = prefixes.find(p => event.textBody.startsWith(p));
                if (!prefixUsed) return;
                const args = event.textBody.substring(prefixUsed.length).trim().split(' ');
                if (args[0] == 'status' && args[1] == 'reservationsByRoomDate' && args[2] == roomid && args[3] == 'True') {
                    const list = JSON.parse(args[4])
                    for (const rooms of list) {
                        rooms.officeid = rooms.officeid + '-' + process.env.ROOM_ID.split(':')[1]
                    }
                    return res.json(list)
                }
                if (args[0] == 'status' && args[1] == 'reservationsByRoomDate' && args[2] == roomid && args[3] == 'False') {
                    return res.status(203).json({
                        message: "Something is wrong",
                    });
                }
            });

        } catch (error) {
            return res.status(203).json({
                message: "Please,select a room to reserve outside",
            });
        }
    }
}