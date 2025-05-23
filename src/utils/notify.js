import { Notify } from 'quasar'

export const notify = ({ color, message, icon }) => {
    Notify.create({
        progress: true,
        timeout: 3000,
        position: 'center',
        color,
        message,
        icon
    })
}
