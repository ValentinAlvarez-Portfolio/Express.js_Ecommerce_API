

export class Logger  {

      sendLog(req, log) {

            req.logger[log.level ? log.level : 500](log.meta);

            return;

      }

}